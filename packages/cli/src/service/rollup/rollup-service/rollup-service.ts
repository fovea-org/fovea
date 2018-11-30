import {IRollupService} from "./i-rollup-service";
import {IRollupErrorObserver, IRollupServiceGenerateOptions} from "./i-rollup-service-generate-options";
import {IRollupServiceGenerateWithResultOptions} from "./i-rollup-service-generate-with-result-options";
import {OutputChunk, OutputOptions, Plugin, rollup, RollupBuild, RollupDirOptions, watch, Watcher} from "rollup";
import {IRollupPrePluginsOptions} from "./i-rollup-pre-plugins-options";
import typescriptRollupPlugin from "@wessberg/rollup-plugin-ts";
import {IRollupPostPluginsOptions} from "./i-rollup-post-plugins-options";
import {IRollupServiceGenerateWithResultResult} from "./i-rollup-service-generate-with-result-result";
import {sync} from "resolve";
import {envRollupPlugin} from "../plugin/env-plugin/env-plugin";
import {resolvePlugin} from "../plugin/resolve-plugin/resolve-plugin";
import progressRollupPlugin from "../plugin/progress-plugin/progress-plugin";
import {IRollupServiceGenerateObserverPayload} from "./i-rollup-service-generate-observer-payload";
// @ts-ignore
import {builtinModules} from "module";
import {Observable, Subscriber} from "rxjs";
import {filter, take} from "rxjs/operators";
import {BuildError} from "../../../error/build-error/build-error";
import {IOperationEnd, Operation, OperationKind} from "../../../operation/operation";
import {FSWatcher} from "chokidar";

// tslint:disable:no-any

/**
 * A class that helps with working with Rollup
 */
export class RollupService implements IRollupService {

	/**
	 * Generates a bundle with Rollup
	 * @param {IRollupServiceGenerateOptions} options
	 * @returns {Observable<IRollupServiceGenerateObserverPayload>}
	 */
	public generate (options: IRollupServiceGenerateOptions): Observable<Operation<IRollupServiceGenerateObserverPayload>> {
		const {output, input, context, treeshake, bundleExternals = false, packageJson, cache, plugins = [], errorObserver} = options;

		const rollupOptions: RollupDirOptions|null = {
			input,
			plugins: [
				...this.getDefaultPrePlugins(options),
				...plugins,
				...this.getDefaultPostPlugins(options)
			],
			context,
			treeshake,
			perf: true,
			external: bundleExternals ? [] : [
				...(packageJson.dependencies != null ? Object.keys(packageJson.dependencies) : []),
				...(packageJson.devDependencies != null ? Object.keys(packageJson.devDependencies) : []),
				...(packageJson.peerDependencies != null ? Object.keys(packageJson.peerDependencies) : []),
				// Don't mark the 'process' module as external since it will be processed by the environment plugin
				...builtinModules.filter(module => module !== "process")
			],
			...(cache == null ? {} : {cache}),
			experimentalCodeSplitting: true,
			inlineDynamicImports: false
		};

		return this.run(rollupOptions, output, errorObserver, options.watch === true);
	}

	/**
	 * Generates a bundle with Rollup and returns the result
	 * @param {IRollupServiceGenerateWithResultOptions} options
	 * @returns {Promise<IRollupServiceGenerateWithResultResult<T>>}
	 */
	public async generateWithResult<T> (options: IRollupServiceGenerateWithResultOptions): Promise<IRollupServiceGenerateWithResultResult<T>> {
		const {data: {outputBundle, cache}} = <IOperationEnd<IRollupServiceGenerateObserverPayload>> await this.generate({
			...options,
			context: "global",
			output: {format: "cjs"},
			errorObserver: {
				error: error => {
					throw error;
				}
			}
		})
			.pipe(filter(({kind}) => kind === OperationKind.END))
			.pipe(take(1))
			.toPromise();

		const resultObject = <{ exports: T }><any> {exports: {}};
		const {code} = <OutputChunk> Object.values(outputBundle)[0];

		// Execute the file and return the result. Resolve all required modules relative to the project root
		new Function("module", "exports", "require", `${code}`)(resultObject, resultObject.exports, (id: string) => require(sync(id, {basedir: options.cwd})));
		return {
			result: "default" in resultObject.exports ? (<any>resultObject).exports.default : resultObject.exports,
			cache
		};
	}

	/**
	 * Runs Rollup once and returns an Observable
	 * @param {RollupDirOptions} options
	 * @param {OutputOptions} output
	 * @param {IRollupErrorObserver} errorObserver
	 * @returns {Observable<Operation<IRollupServiceGenerateObserverPayload>>}
	 */
	private runOnce (options: RollupDirOptions, output: OutputOptions, errorObserver: IRollupErrorObserver): Observable<Operation<IRollupServiceGenerateObserverPayload>> {
		return new Observable<Operation<IRollupServiceGenerateObserverPayload>>(subscriber => {
			let isCanceled: boolean = false;

			this.didStartBundling(subscriber);

			rollup(options)
				.then(async bundleSet => {
					if (isCanceled) return;

					await this.didEndBundling(bundleSet, output, subscriber, errorObserver);
				})
				.catch(error => {
					this.didErrorBundling(error, true, errorObserver);
				});

			return () => {
				isCanceled = true;
			};
		});
	}

	/**
	 * Runs Rollup in watch mode and returns an Observable
	 * @param {RollupDirOptions} options
	 * @param {OutputOptions} output
	 * @param {IRollupErrorObserver} errorObserver
	 * @returns {Observable<Operation<IRollupServiceGenerateObserverPayload>>}
	 */
	private runInWatchMode (options: RollupDirOptions, output: OutputOptions, errorObserver: IRollupErrorObserver): Observable<Operation<IRollupServiceGenerateObserverPayload>> {
		return new Observable<Operation<IRollupServiceGenerateObserverPayload>>(subscriber => {
			// Otherwise, create a new Observable from Chokidar events and handle their values
			process.env.ROLLUP_WATCH = "true";
			let watcher: Watcher|undefined = watch([{...options, output}]);
			const eventListener = (event: any) => this.didReceiveRollupEvent(event, output, subscriber, errorObserver);
			watcher.on("event", eventListener);

			return () => {

				if (watcher != null) {

					watcher.off("event", eventListener);
					(<FSWatcher>watcher).close();

					watcher = undefined;
				}
			};
		});
	}

	/**
	 * Runs Rollup based on the given configuration and returns an Observable of the results over time
	 * @param {RollupDirOptions} options
	 * @param {OutputOptions} output
	 * @param {IRollupErrorObserver} errorObserver
	 * @param {boolean} watchMode
	 * @returns {Observable<Operation<IRollupServiceGenerateObserverPayload>>}
	 */
	private run (options: RollupDirOptions, output: OutputOptions, errorObserver: IRollupErrorObserver, watchMode: boolean): Observable<Operation<IRollupServiceGenerateObserverPayload>> {
		return watchMode
			? this.runInWatchMode(options, output, errorObserver)
			: this.runOnce(options, output, errorObserver);
	}

	/**
	 * Invoked when an event is received from Rollup
	 * @param event
	 * @param {OutputOptions} output
	 * @param {Subscriber<Operation<IRollupServiceGenerateObserverPayload>>} subscriber
	 * @param {IRollupErrorObserver} errorObserver
	 */
	private didReceiveRollupEvent (event: any, output: OutputOptions, subscriber: Subscriber<Operation<IRollupServiceGenerateObserverPayload>>, errorObserver: IRollupErrorObserver): void {
		const {code, result, error} = event;

		switch (code) {
			case "START":
				this.didStartBundling(subscriber);
				break;
			case "ERROR":
			case "FATAL":
				this.didErrorBundling(error, code === "FATAL", errorObserver);
				break;
			case "BUNDLE_END":
				this.didEndBundling(result, output, subscriber, errorObserver).then();
				break;
		}
	}

	/**
	 * Invoked when an Error occurred during bundling
	 * @param {Error} error
	 * @param {boolean} fatal
	 * @param {IRollupErrorObserver} errorObserver
	 * @returns {void}
	 */
	private didErrorBundling (error: Error, fatal: boolean, errorObserver: IRollupErrorObserver): void {
		errorObserver.error(error instanceof BuildError ? error : new BuildError({
			data: error,
			fatal
		}));
	}

	/**
	 * Invoked when a bundle set has been generated
	 * @param {Subscriber<Operation<IRollupServiceGenerateObserverPayload>>} subscriber
	 * @returns {void}
	 */
	private didStartBundling (subscriber: Subscriber<Operation<IRollupServiceGenerateObserverPayload>>): void {
		subscriber.next({
			kind: OperationKind.START
		});
	}

	/**
	 * Invoked when a bundle set has been generated
	 * @param {RollupBuild} bundleSet
	 * @param {OutputOptions} outputOptions
	 * @param {Subscriber<Operation<IRollupServiceGenerateObserverPayload>>} subscriber
	 * @param {IRollupErrorObserver} errorObserver
	 * @returns {Promise<void>}
	 */
	private async didEndBundling (bundleSet: RollupBuild, outputOptions: OutputOptions, subscriber: Subscriber<Operation<IRollupServiceGenerateObserverPayload>>, errorObserver: IRollupErrorObserver): Promise<void> {
		try {
			subscriber.next({
				kind: OperationKind.END,
				data: {
					outputBundle: (await bundleSet.generate(outputOptions)).output,
					cache: bundleSet.cache
				}
			});
		} catch (ex) {
			errorObserver.error(new BuildError({
				data: ex,
				fatal: true
			}));
		}
	}

	/**
	 * Gets the default "pre" plugins (those that must come before anything else)
	 * @param {IRollupPrePluginsOptions} options
	 * @returns {Plugin[]}
	 */
	private getDefaultPrePlugins ({cwd, progress, additionalEnvironmentVariables = {}}: IRollupPrePluginsOptions): Plugin[] {
		return [
			...(progress != null && progress !== false ? [progressRollupPlugin({cwd, ...progress})] : []),
			envRollupPlugin({
				additional: additionalEnvironmentVariables
			}),
			resolvePlugin({cwd})
		];
	}

	/**
	 * Gets the default "post" plugins (those that must come after anything else)
	 * @param {IRollupPostPluginsOptions} options
	 * @returns {Plugin[]}
	 */
	private getDefaultPostPlugins (options: IRollupPostPluginsOptions): Plugin[] {
		return [
			typescriptRollupPlugin(options)
		];
	}

}