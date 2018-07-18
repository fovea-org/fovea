import {IRollupService} from "./i-rollup-service";
import {IRollupServiceGenerateOptions} from "./i-rollup-service-generate-options";
import {IRollupServiceGenerateWithResultOptions} from "./i-rollup-service-generate-with-result-options";
import {OutputChunk, OutputOptions, Plugin, rollup, RollupBuild, RollupDirOptions, watch, Watcher} from "rollup";
import {IRollupPrePluginsOptions} from "./i-rollup-pre-plugins-options";
import typescriptRollupPlugin from "@wessberg/rollup-plugin-ts";
import {IRollupPostPluginsOptions} from "./i-rollup-post-plugins-options";
import {IRollupServiceGenerateWithResultResult} from "./i-rollup-service-generate-with-result-result";
import {sync} from "resolve";
import {envRollupPlugin} from "../plugin/env-plugin/env-plugin";
import {resolvePlugin} from "../plugin/resolve-plugin/resolve-plugin";
import {IRollupServiceGenerateObserverPayload} from "./i-rollup-service-generate-observer-payload";
import {IObserver} from "../../../observable/i-observer";
import {ISubscriber} from "../../../observable/i-subscriber";
// @ts-ignore
import {builtinModules} from "module";

// tslint:disable:no-any

/**
 * A class that helps with working with Rollup
 */
export class RollupService implements IRollupService {

	/**
	 * Generates a bundle with Rollup
	 * @param {IRollupServiceGenerateOptions} options
	 * @returns {Promise<IObserver>}
	 */
	public async generate (options: IRollupServiceGenerateOptions): Promise<IObserver> {
		const {output, input, observer, context, bundleExternals = false, packageJson, cache, plugins = []} = options;
		const rollupOptions: RollupDirOptions = {
			input,
			plugins: [
				...this.getDefaultPrePlugins(options),
				...plugins,
				...this.getDefaultPostPlugins(options)
			],
			context,
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

		// If watch mode should be active
		if (options.watch != null && options.watch) {
			process.env.ROLLUP_WATCH = "true";
			const watcher: Watcher = watch([{
				...rollupOptions,
				output
			}]);

			const eventHandler = async (ex: any) => {
				const {code, result, error} = ex;
				switch (code) {
					case "START":
						return await this.didStartBundling(observer);
					case "ERROR":
						return observer.onError({data: error, fatal: false});
					case "FATAL":
						return observer.onError({data: error, fatal: true});
					case "BUNDLE_END":
						return await this.didEndBundling(result, output, observer);
				}
			};

			// Listen for Rollup events
			watcher.on("event", eventHandler);

			// Return a hook to stop listening for Rollup events
			return {
				unobserved: false,
				unobserve () {
					this.unobserved = true;
					watcher.off("event", eventHandler);
				}
			};
		}

		// Otherwise, bundle once and write to disk
		else {
			// Generate a bundle from the result
			this.didStartBundling(observer).then();
			try {
				this.didEndBundling(await rollup(rollupOptions), output, observer).then();
			} catch (ex) {
				observer.onError({data: ex, fatal: true});
			}

			// Return a Noop
			return {
				unobserved: false,
				unobserve () {
					this.unobserved = true;
				}
			};
		}
	}

	/**
	 * Generates a bundle with Rollup and returns the result
	 * @param {IRollupServiceGenerateWithResultOptions} options
	 * @returns {Promise<IRollupServiceGenerateWithResultResult<T>>}
	 */
	public async generateWithResult<T> (options: IRollupServiceGenerateWithResultOptions): Promise<IRollupServiceGenerateWithResultResult<T>> {
		const {outputBundle, cache} = await new Promise<IRollupServiceGenerateObserverPayload>(async resolve => {
			const observer = await this.generate({
				...options,
				context: "global",
				output: {format: "cjs"},
				observer: {
					onError: () => {},
					onStart: () => {},
					onEnd: payload => {
						resolve(payload);
						observer.unobserve();
					}
				}
			});
		});

		const resultObject = <{ exports: T }><any> {exports: {}};
		const {code} = <OutputChunk> Object.values(outputBundle)[0];

		// Execute the file and return the result. Resolve all required modules relative to the project root
		new Function("module", "exports", "require", `${code}`)(resultObject, resultObject.exports, (id: string) => require(sync(id, {basedir: options.root})));
		return {
			result: "default" in resultObject.exports ? (<any>resultObject).exports.default : resultObject.exports,
			cache
		};
	}

	/**
	 * Invoked when bundling has started
	 * @param {ISubscriber<IRollupServiceGenerateObserverPayload>} subscriber
	 * @returns {Promise<void>}
	 */
	private async didStartBundling (subscriber: ISubscriber<IRollupServiceGenerateObserverPayload>): Promise<void> {
		// Generate a bundle from the result and invoke the listener
		subscriber.onStart();
	}

	/**
	 * Invoked when a bundle set has been generated
	 * @param {RollupBuild} bundleSet
	 * @param {OutputOptions} outputOptions
	 * @param {ISubscriber<IRollupServiceGenerateObserverPayload>} subscriber
	 * @returns {Promise<void>}
	 */
	private async didEndBundling (bundleSet: RollupBuild, outputOptions: OutputOptions, subscriber: ISubscriber<IRollupServiceGenerateObserverPayload>): Promise<void> {
		try {
			const emitResult: IRollupServiceGenerateObserverPayload = {
				outputBundle: (await bundleSet.generate(outputOptions)).output,
				cache: bundleSet.cache
			};

			// Generate a bundle from the result and invoke the listener
			subscriber.onEnd(emitResult);
		} catch (error) {
			subscriber.onError({data: error, fatal: false});
		}
	}

	/**
	 * Gets the default "pre" plugins (those that must come before anything else)
	 * @param {IRollupPrePluginsOptions} options
	 * @returns {Plugin[]}
	 */
	private getDefaultPrePlugins ({root, additionalEnvironmentVariables = {}}: IRollupPrePluginsOptions): Plugin[] {
		return [
			envRollupPlugin({
				additional: additionalEnvironmentVariables
			}),
			resolvePlugin({root})
		];
	}

	/**
	 * Gets the default "post" plugins (those that must come after anything else)
	 * @param {string} root
	 * @param {string} tsconfig
	 * @param {string|string[]} browserslist
	 * @param {{}[]} additionalBabelPlugins
	 * @param {{}[]} additionalBabelPresets
	 * @returns {Plugin[]}
	 */
	private getDefaultPostPlugins ({root, tsconfig, browserslist, additionalBabelPlugins, additionalBabelPresets}: IRollupPostPluginsOptions): Plugin[] {
		return [
			typescriptRollupPlugin({root, tsconfig, browserslist, additionalBabelPlugins, additionalBabelPresets})
		];
	}

}