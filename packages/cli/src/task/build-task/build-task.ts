import {IBuildTask} from "./i-build-task";
import {IBuildTaskExecuteOptions} from "./i-build-task-execute-options";
import {IProjectPathUtil} from "../../util/project-path-util/i-project-path-util";
import {IFoveaCliOutputConfig} from "../../fovea-cli-config/i-fovea-cli-config";
import {ILoggerService} from "../../service/logger/i-logger-service";
import {IBundlerService} from "../../service/bundler/i-bundler-service";
import chalk from "chalk";
import {IFileSaver} from "@wessberg/filesaver";
import {IManifestJsonWriterService} from "../../service/writer/manifest-json-writer/i-manifest-json-writer-service";
import {IIndexHtmlWriterService} from "../../service/writer/index-html-writer/i-index-html-writer-service";
import {IFileLoader} from "@wessberg/fileloader";
import {IAssetWriterService} from "../../service/writer/asset-writer/i-asset-writer-service";
import {IResource} from "../../resource/i-resource";
import Fovea from "@fovea/rollup-plugin-fovea";
import {IBuildConfig} from "../../build-config/i-build-config";
import {IBabelMinifyOptions} from "../../service/minify/i-babel-minify-options";
import {ICompressorService} from "../../service/compression/i-compressor-service";
import {browserslistSupportsFeatures} from "@wessberg/browserslist-generator";
import {ModuleFormat} from "rollup";
import {FeatureKind} from "../../feature-kind/feature-kind";
import {IProjectParserService} from "../../service/parser/project-parser/i-project-parser-service";
import {IStylesParserService} from "../../service/parser/styles-parser/i-styles-parser-service";
import {IIndexHtmlParserService} from "../../service/parser/index-html-parser/i-index-html-parser-service";
import {IManifestJsonParserService} from "../../service/parser/manifest-json-parser/i-manifest-json-parser-service";
import {IAssetOptimizerService} from "../../service/asset-optimizer/i-asset-optimizer-service";
import {compressRollupPlugin} from "../../service/rollup/plugin/compress-plugin/compress-plugin";
import {IPolyfillService} from "../../service/polyfill/i-polyfill-service";
import {IBuildServiceWorkerOptions} from "./i-build-service-worker-options";
import {ISharedRollupOptions} from "./i-shared-rollup-options";
import {IServeOptions} from "./i-serve-options";
import {IDevServerServiceServeOptions} from "../../service/dev-server/i-dev-server-service-serve-options";
import {IDevServerService} from "../../service/dev-server/i-dev-server-service";
import {IBuildProjectOptions} from "./i-build-project-options";
import {IBuildStylesOptions} from "./i-build-styles-options";
import {IBuildOutputOptions} from "./i-build-output-options";
import {IBuildOutputFilesOptions} from "./i-build-output-files-options";
import {IBuildOutputBundleOptions} from "./i-build-output-bundle-options";
import {IBuildOutputFromStylesOptions} from "./i-build-output-from-styles-options";
import {EventEmitter} from "events";
import {BuildStatusKind} from "./build-status-kind";
import {IBuildOptions} from "./i-build-options";
import {IBuildAssetsOptions} from "./i-build-assets-options";
import {IAssetParserService} from "../../service/parser/asset-parser/i-asset-parser-service";
import {IBuildOutputsOptions} from "./i-build-outputs-options";
import {IAssetOptimizerServiceOptimizeDirectoryResult} from "../../service/asset-optimizer/i-asset-optimizer-service-optimize-directory-result";
import {IDiskCacheRegistryService} from "../../service/cache-registry/disk-cache-registry/i-disk-cache-registry-service";
import {CacheEntryKind} from "../../service/cache-registry/cache-entry-kind";
import {IAssetOptimizerServiceOptimizeDirectoryOptions} from "../../service/asset-optimizer/i-asset-optimizer-service-optimize-directory-options";
import {ICacheRegistryGetOptionsMap} from "../../service/cache-registry/i-cache-registry-get-options";
import {FoveaDiagnosticDegree} from "@fovea/compiler";
import {IEnvironmentDefaults} from "../../environment/i-environment-defaults";
import {buildEnvironment} from "../../build-environment/build-environment";
import {IRollupPostPluginsOptions} from "../../service/rollup/rollup-service/i-rollup-post-plugins-options";
import {IRollupServiceGenerateOptions} from "../../service/rollup/rollup-service/i-rollup-service-generate-options";
import {ICompressionAlgorithmOptions} from "../../service/compression/compression-algorithm-options";
import {combineLatest, from, merge, Observable, of} from "rxjs";
import {map, mergeMap, switchMap, tap} from "rxjs/operators";
import {ensureArray} from "../../util/iterable/iterable-util";
import {BuildError} from "../../error/build-error/build-error";
import {IBuildAssetsEndResult} from "./i-build-assets-result";
import {IOperationEnd, IOperationStart, Operation, OPERATION_END, OPERATION_START, OperationKind} from "../../operation/operation";
import {IStylesParserServiceEndResult} from "../../service/parser/styles-parser/i-styles-parser-service-result";
import {IBundlerServiceBundlingEndedResult} from "../../service/bundler/i-bundler-service-bundling-ended-data";

// tslint:disable:no-any

/**
 * A task used for building a Fovea project
 */
export class BuildTask implements IBuildTask {
	/**
	 * An EventEmitter that can emit build-related events
	 * @type {EventEmitter}
	 */
	private readonly buildEventEmitter: EventEmitter = new EventEmitter();

	/**
	 * The time of the last time the build status changed
	 * @type {number}
	 */
	private timeOfLastBuildStatusChange: number;

	/**
	 * The current build status
	 * @type {BuildStatusKind}
	 */
	private buildStatus: BuildStatusKind;

	constructor (private readonly logger: ILoggerService,
							 private readonly config: IBuildConfig,
							 private readonly projectParser: IProjectParserService,
							 private readonly projectPathUtil: IProjectPathUtil,
							 private readonly stylesParser: IStylesParserService,
							 private readonly manifestJsonParser: IManifestJsonParserService,
							 private readonly indexHtmlParser: IIndexHtmlParserService,
							 private readonly assetParser: IAssetParserService,
							 private readonly assetOptimizer: IAssetOptimizerService,
							 private readonly bundler: IBundlerService,
							 private readonly fileSaver: IFileSaver,
							 private readonly fileLoader: IFileLoader,
							 private readonly manifestJsonWriter: IManifestJsonWriterService,
							 private readonly indexHtmlWriter: IIndexHtmlWriterService,
							 private readonly assetWriter: IAssetWriterService,
							 private readonly minifyOptions: IBabelMinifyOptions,
							 private readonly compressor: ICompressorService,
							 private readonly compressionAlgorithmOptions: ICompressionAlgorithmOptions,
							 private readonly polyfillService: IPolyfillService,
							 private readonly devServer: IDevServerService,
							 private readonly cacheService: IDiskCacheRegistryService) {
		this.updateStatus(BuildStatusKind.READY);
	}

	/**
	 * Gets the time that has passed since the last time the build status changed
	 * @type {number}
	 */
	private get timeSinceLastBuildStatusChange (): number {
		return Date.now() - this.timeOfLastBuildStatusChange;
	}

	/**
	 * Executes a 'build' task
	 * @param {IBuildTaskExecuteOptions} buildTaskOptions
	 * @returns {Promise<void>}
	 */
	public async execute (buildTaskOptions: IBuildTaskExecuteOptions): Promise<void> {
		this.logger.setVerbose(buildTaskOptions.verbose);
		this.logger.setDebug(buildTaskOptions.debug);
		this.logger.debug(`Debugging is active`);
		this.logger.verbose(`Verbose output is active`);

		if (buildTaskOptions.no_cache) {
			this.logger.log(`Cache is ${chalk.magenta("off")}`);
		}

		if (buildTaskOptions.watch) {
			this.logger.log(`Watch mode is ${chalk.magenta("on")}`);
		}

		if (buildTaskOptions.serve) {
			this.logger.log(`Serve is ${chalk.magenta("on")}`);
		}

		if (buildTaskOptions.production) {
			this.logger.log(`Production is ${chalk.magenta("on")}`);
		}

		// The set of all cleared directories
		const clearedDirectories: Set<string> = new Set();

		const subscription = this.build({buildTaskOptions, clearedDirectories})
			.subscribe({

				// Update the build status to 'holding'
				error: error => this.updateStatus(BuildStatusKind.HOLDING, error),

				// Invoked when the next operation emits a value
				next: (operation) => {

					switch (operation.kind) {
						case OperationKind.START:
							// Update the status of the build
							this.updateStatus(BuildStatusKind.BUILDING);
							break;

						case OperationKind.END:
							// Update the status of the build
							this.updateStatus(BuildStatusKind.BUILT);

							// Unobserve the project immediately if not in watch mode
							if (!buildTaskOptions.watch) {
								subscription.unsubscribe();
							}
							break;
					}
				}
			});
	}

	/**
	 * Begins the built
	 * @param {IBuildTaskExecuteOptions} options
	 * @returns {Observable<Operation<void>>}
	 */
	private build (options: IBuildOptions): Observable<Operation<void>> {
		return this.projectParser.parse(options.buildTaskOptions)
			.pipe(
				switchMap(project => {
					if (project.kind === OperationKind.START) {
						return of(OPERATION_START());
					}

					return this.buildProject({...options, project: project.data});
				})
			);
	}

	/**
	 * Called each time the project changes
	 * @param {IBuildProjectOptions} options
	 * @returns {Observable<Operation<void>>}
	 */
	private buildProject (options: IBuildProjectOptions): Observable<Operation<void>> {
		return this.buildAssets(options)
			.pipe(
				switchMap((assets) => {
					if (assets.kind === OperationKind.START) {
						return of(OPERATION_START());
					}

					return this.buildOutputs({...options, assets: assets.data});
				})
			);
	}

	/**
	 * Discovers and optimizes assets
	 * @param {IBuildAssetsOptions} options
	 * @returns {Observable<Operation<IBuildAssetsEndResult>>}
	 */
	private buildAssets ({project, buildTaskOptions}: IBuildAssetsOptions): Observable<Operation<IBuildAssetsEndResult>> {
		const {foveaCliConfig, root} = project;

		return this.assetParser.parse({project})
			.pipe(
				switchMap(async (result) => {
					if (result.kind === OperationKind.START) {
						return OPERATION_START();
					}

					this.logger.verbose(`Optimizing assets...`);

					const {data: {assetMap, appIcon}} = result;

					const optimizeOptions: IAssetOptimizerServiceOptimizeDirectoryOptions = {
						assetMap,
						appIcon: {...appIcon, sizes: foveaCliConfig.asset.appIcon.sizes},
						options: {...foveaCliConfig.asset.optimization, assetDir: foveaCliConfig.asset.path}
					};

					const cacheOptions: ICacheRegistryGetOptionsMap[CacheEntryKind.OPTIMIZED_ASSET_BUFFERS] = {
						cacheOptions: {
							root,
							skip: buildTaskOptions.no_cache
						},
						entryKindOptions: optimizeOptions
					};

					// Optimize assets and generate app icons
					let assets: IAssetOptimizerServiceOptimizeDirectoryResult;

					// If the cache is not good enough here, run the asset optimizer and update the cache
					if (await this.cacheService.cacheNeedsUpdate(CacheEntryKind.OPTIMIZED_ASSET_BUFFERS, cacheOptions)) {
						assets = await this.assetOptimizer.optimizeDirectory(optimizeOptions);
						await this.cacheService.set(CacheEntryKind.OPTIMIZED_ASSET_BUFFERS, cacheOptions, assets);
					}

					// Otherwise, take the already optimized buffers from the cache
					else {
						assets = (await this.cacheService.get(CacheEntryKind.OPTIMIZED_ASSET_BUFFERS, cacheOptions))!;
					}

					this.logger.verbose(`Successfully optimized assets!`);

					return {
						kind: <OperationKind.END> OperationKind.END,
						data: assets
					};
				})
			);
	}

	/**
	 * Returns true if the given output should be built
	 * @param {IFoveaCliOutputConfig} output
	 * @param {IBuildTaskExecuteOptions} buildTaskOptions
	 * @returns {boolean}
	 */
	private shouldBuildOutput (output: IFoveaCliOutputConfig, buildTaskOptions: IBuildTaskExecuteOptions): boolean {
		// Make sure that the output is not disabled
		if (output.disable === true) return false;

		// If in watch mode, make sure the output is not disabled in watch mode
		if (buildTaskOptions.watch) return output.disable !== "watch";

		// Accept it!
		return true;
	}

	/**
	 * Builds all outputs
	 * @param {IBuildProjectOptions} options
	 * @returns {Observable<Operation<void>>}
	 */
	private buildOutputs (options: IBuildOutputsOptions): Observable<Operation<void>> {
		const {foveaCliConfig} = options.project;

		// Only use those outputs that should not be disabled in watch mode - if this build is for watch mode
		const filteredOutputs = ensureArray(foveaCliConfig.output)
			.filter(output => this.shouldBuildOutput(output, options.buildTaskOptions));

		// Loop through all of the outputs in parallel
		return from(filteredOutputs)
			.pipe(
				tap(({tag}) => this.logger.log(`Building output: ${chalk.magenta(tag)}`)),
				mergeMap((output, index) => this.buildOutput({...options, output, index})
					.pipe(
						tap(({kind}) => {
							if (kind === OperationKind.END) {
								this.logger.log(`Successfully built ${chalk.magenta(output.tag)}!`);
							}
						})
					))
			);
	}

	/**
	 * Builds an output from an IFoveaCliConfig
	 * @param {IBuildOutputOptions} options
	 * @returns {Observable<Operation<void>>}
	 */
	private buildOutput (options: IBuildOutputOptions): Observable<Operation<void>> {
		const {output, assets, clearedDirectories, project} = options;
		const {foveaCliConfig, root, hash} = project;

		// Get all output paths
		const outputPaths = this.projectPathUtil.getOutputPathsForOutput({
			root,
			foveaCliConfig,
			assets,
			hash,
			output
		});

		this.clearDestinationDirectory(outputPaths.directory.absolute, clearedDirectories);

		return this.buildStyles(options)
			.pipe(
				switchMap(styles => {
					if (styles.kind === OperationKind.START) {
						return of(OPERATION_START());
					}

					return this.buildOutputFromStyles({...options, styles: styles.data, outputPaths});
				})
			);
	}

	/**
	 * Builds anything but the styles for a bundle
	 * @param {IBuildOutputFromStylesOptions} options
	 * @returns {Observable<Operation<void>>}
	 */
	private buildOutputFromStyles (options: IBuildOutputFromStylesOptions): Observable<Operation<void>> {
		const {output, outputPaths, project, buildTaskOptions, assets, styles: {globalStyles, themeVariables}} = options;
		const {foveaCliConfig, hash, root, packageJson} = project;
		let hasServed: boolean = false;

		// Prepare the IResource
		const resource: IResource = {
			style: {
				themeVariables
			},
			output: this.projectPathUtil.getOutputResourceFromOutputPath(outputPaths, [])
		};

		// Whether or not to use ES-modules depend on the given browserslist. If none is given, ES modules *will* be used. Otherwise, it will fall back to SystemJS for browsers without support
		const moduleKind: ModuleFormat = output.browserslist == null || browserslistSupportsFeatures(output.browserslist, ...this.config.esmCaniuseFeatureNames) ? "es" : "system";

		// Whether or not to transpile async functions
		const asyncFunctionKind: FeatureKind = output.browserslist == null || browserslistSupportsFeatures(output.browserslist, "async-functions") ? "native" : "polyfill";

		// Prepare polyfills. If the output format is not ES modules, we have to apply a module loader such as SystemJS.
		// And, if async functions are transpiled, we have to be able to execute them anyway
		const polyfills = [
			...foveaCliConfig.polyfills,
			// Add a polyfill for modules (using SystemJS) if format of the build is not ES modules
			...(moduleKind !== "es" ? ["systemjs"] : []),
			// Add the regenerator runtime for executing async functions if async/await and/or generator functions has been transpiled
			...(asyncFunctionKind !== "native" ? ["regenerator-runtime"] : [])
		];

		// Prepare polyfills for workers. These are like for the main thread, except only those that are compatible with Workers are accepted
		const workerPolyfills = polyfills.filter(polyfill => this.polyfillService.isWorkerCompatible(polyfill));

		// Defined additional environment variables based on the current output
		const additionalEnvironmentVariables = {
			NODE_ENV: buildTaskOptions.production ? "production" : buildEnvironment.NODE_ENV != null ? buildEnvironment.NODE_ENV : "development",
			NPM_PACKAGE_NAME: packageJson.name,
			NPM_PACKAGE_DESCRIPTION: packageJson.description,
			NPM_PACKAGE_VERSION: packageJson.version,
			MODULE_KIND: moduleKind,
			WATCH: String(buildTaskOptions.watch != null && buildTaskOptions.watch),
			TAG: output.tag,
			HASH: hash,
			RESOURCE: JSON.stringify(resource)
		};

		// The options to provide to rollup service consumers
		const sharedRollupOptions: ISharedRollupOptions = {
			root,
			tsconfig: foveaCliConfig.tsconfig,
			additionalEnvironmentVariables,
			packageJson,
			resource,
			config: foveaCliConfig
		};

		return combineLatest(
			this.buildOutputBundle({...options, workerPolyfills, resource, additionalEnvironmentVariables, moduleKind, sharedRollupOptions})
				.pipe(
					tap(result => {
						if (result.kind === OperationKind.END) {
							this.logger.verboseTag(output.tag, `Successfully generated bundle!`);
						}
					})
				),
			this.buildOutputFiles({...options, polyfills, globalStyles, sharedRollupOptions})
				.pipe(
					tap(result => {
						if (result.kind === OperationKind.END) {
							this.logger.verboseTag(output.tag, `Successfully built ${chalk.magenta(`${this.config.indexName}.${this.config.defaultXMLScriptExtension}`)} and ${chalk.magenta(`${this.config.manifestName}.${this.config.defaultJsonExtension}`)} files!`);
						}
					})
				)
		)
			.pipe(
				switchMap(([bundleResult, outputFileResult]): Observable<Operation<void>> => {
					if (bundleResult.kind === OperationKind.START || outputFileResult.kind === OperationKind.START) {
						return of(OPERATION_START());
					}

					this.logger.verboseTag(output.tag, `Writing assets to disk`);

					// TODO: Only do this if they have changed. This happens for each and every change to code in watch mode!

					const assetWriterObservable = from(this.assetWriter.write(
						Object.assign({},
							...Object.entries(outputPaths.asset.appIcon).map(([key, path]) => ({[path.absolute]: assets.appIconMap[key]})),
							...Object.entries(outputPaths.asset.other).map(([key, path]) => ({[path.absolute]: assets.assetMap[key]}))
						), {compress: this.shouldCompress(output, buildTaskOptions), ...this.getCompressOptions(output)}))
						.pipe(tap(() => this.logger.verboseTag(output.tag, `Successfully wrote all assets to disk!`)));

					const shouldServe = !hasServed && buildTaskOptions.serve != null && buildTaskOptions.serve;
					if (!shouldServe) {
						return assetWriterObservable.pipe(map(() => OPERATION_END()));
					} else {
						hasServed = true;

						const serveObservable = this.serve({
							index: options.index,
							buildTaskOptions,
							output,
							resource: () => resource.output,
							outputPaths: () => outputPaths
						});

						return merge(
							assetWriterObservable,
							serveObservable
						).pipe(map(() => OPERATION_END()));
					}
				}));
	}

	/**
	 * Adds environment variable values to the given scss content
	 * @param {object} environmentVariables
	 * @param {string} content
	 */
	private addEnvironmentVariablesToScss (environmentVariables: { [key: string]: string }, content: string): string {
		const environmentNames: (keyof IEnvironmentDefaults)[] = ["NODE_ENV", "NPM_PACKAGE_NAME", "NPM_PACKAGE_VERSION", "WATCH", "TAG", "HASH"];
		let replacedString = content;
		environmentNames.forEach(environmentName => {
			replacedString = replacedString.replace(new RegExp(`(\\$${environmentName}:)[^;]*`, "g"), `$1 "${environmentVariables[environmentName]}"`);
		});
		return replacedString;
	}

	/**
	 * Returns true if minification should be applied to generated bundles
	 * @param {IFoveaCliOutputConfig} output
	 * @param {IBuildTaskExecuteOptions} buildTaskOptions
	 * @returns {boolean}
	 */
	private shouldMinify (output: IFoveaCliOutputConfig, buildTaskOptions: IBuildTaskExecuteOptions): boolean {
		const userProvidedOption = output.optimization == null || output.optimization.minify == null ? undefined : output.optimization.minify;
		if (userProvidedOption == null) {
			// When nothing else is given, only minify in production
			return buildTaskOptions.production;
		} else {
			// Otherwise, use whatever option was given by the user
			return userProvidedOption !== false;
		}
	}

	/**
	 * Returns true if compression should be applied to generated bundles
	 * @param {IFoveaCliOutputConfig} output
	 * @param {IBuildTaskExecuteOptions} buildTaskOptions
	 * @returns {boolean}
	 */
	private shouldCompress (output: IFoveaCliOutputConfig, buildTaskOptions: IBuildTaskExecuteOptions): boolean {
		const userProvidedOption = output.optimization == null || output.optimization.compress == null ? undefined : output.optimization.compress;
		if (userProvidedOption == null) {
			// When nothing else is given, only compress in production
			return buildTaskOptions.production;
		} else {
			// Otherwise, use whatever option was given by the user
			return userProvidedOption !== false;
		}
	}

	/**
	 * Returns whatever option should be provided to Rollup in terms of whether or not to generate sourcemaps
	 * @param {IFoveaCliOutputConfig} output
	 * @param {IBuildTaskExecuteOptions} buildTaskOptions
	 * @returns {IFoveaCliBundleOptimizationConfig["sourcemap"]}
	 */
	private shouldGenerateSourcemaps (output: IFoveaCliOutputConfig, buildTaskOptions: IBuildTaskExecuteOptions): IFoveaCliOutputConfig["sourcemap"] {
		const userProvidedSourceMapOption = output.sourcemap == null ? undefined : output.sourcemap;
		if (userProvidedSourceMapOption == null) {
			// When nothing else is given, only generate sourcemaps in development
			return !buildTaskOptions.production;
		} else {
			// Otherwise, use whatever option was given by the user
			return userProvidedSourceMapOption;
		}
	}

	/**
	 * Builds the bundle for an output
	 * @param {IBuildOutputBundleOptions} options
	 * @returns {Observable<Operation<void>>}
	 */
	private buildOutputBundle (options: IBuildOutputBundleOptions): Observable<Operation<IBundlerServiceBundlingEndedResult>> {
		const {sharedRollupOptions, outputPaths, output, buildTaskOptions, moduleKind, additionalEnvironmentVariables, resource, project} = options;
		const {root, hash, foveaCliConfig} = project;

		return this.bundler.generate({
			...sharedRollupOptions,
			paths: {
				[this.config.entryName]: this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.entry)
			},
			outputPaths,
			bundleName: output.tag,
			hash,
			progress: {
				logger: {
					color: this.logger.LOG_COLOR,
					log: this.logger.logTagOnOneLine.bind(this.logger, output.tag),
					clear: this.logger.clearLastLine.bind(this.logger)
				}
			},
			sourcemap: this.shouldGenerateSourcemaps(output, buildTaskOptions),
			context: "window",
			browserslist: output.browserslist,
			treeshake: this.getTreeshakingOptions(output),
			babel: this.getBabelOptions(output, buildTaskOptions),
			format: moduleKind,
			watch: buildTaskOptions.watch,
			banner: output.banner,
			footer: output.footer,
			intro: output.intro,
			outro: output.outro,
			plugins: [
				Fovea({
					production: this.shouldMinify(output, buildTaskOptions),
					exclude: foveaCliConfig.exclude,
					onDiagnostics: diagnostics => {

						// Only proceed if there are any relevant diagnostics
						if (diagnostics.length > 0) {

							// If any of the diagnostics is an error, invoke the 'onError' subscriber
							if (diagnostics.some(diagnostic => diagnostic.degree === FoveaDiagnosticDegree.ERROR)) {
								throw new BuildError({
									fatal: false,
									data: diagnostics,
									tag: output.tag
								});
							}

							// Otherwise, print it
							else {
								this.logger.logTag(output.tag, diagnostics.toString());
							}
						}
					},
					postcss: {
						plugins: output.postcss == null || output.postcss.additionalPlugins == null ? [] : output.postcss.additionalPlugins,
						hook: pluginName => {
							switch (pluginName) {
								case "postcss-sass": {
									return {
										transform: (_file: string, contents: string): string|null => {
											// Add relevant environment variables to the scss output
											return this.addEnvironmentVariablesToScss(additionalEnvironmentVariables, contents);
										}
									};
								}
								case "postcss-preset-env":
									return {
										...(output.browserslist == null ? {} : {
											// Use the Browserslist of the output options
											browsers: output.browserslist
										})
									};
							}
							return null;
						}
					}
				}),
				...(this.shouldCompress(output, buildTaskOptions) ? [
					// Apply Brotli and Zlib compression
					compressRollupPlugin({
						compressor: this.compressor,
						...this.getCompressOptions(output)
					})
				] : [])
			],
			errorObserver: {
				error: error => this.updateStatus(BuildStatusKind.HOLDING, error)
			}
		})
			.pipe(
				switchMap((payload: IOperationStart|IOperationEnd<IBundlerServiceBundlingEndedResult>) => {
					if (payload.kind === OperationKind.START) {
						return of(OPERATION_START());
					}

					const {data: {generatedChunkNames}} = payload;

					// Refresh the IResource and 'RESOURCE' environment variable
					resource.output = this.projectPathUtil.getOutputResourceFromOutputPath(outputPaths, generatedChunkNames);
					additionalEnvironmentVariables.RESOURCE = JSON.stringify(resource);
					return this.buildServiceWorker({...options, watch: buildTaskOptions.watch});
				}));
	}

	/**
	 * Builds all output files that isn't styles and isn't bundles, such as index.html and manifest.json
	 * @param {IBuildOutputFilesOptions} options
	 * @returns {Observable<Operation<void>>}
	 */
	private buildOutputFiles ({project: {foveaCliConfig, root}, buildTaskOptions, outputPaths, sharedRollupOptions, globalStyles, polyfills, output}: IBuildOutputFilesOptions): Observable<Operation<void>> {
		const manifestPath = this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.manifest);
		const indexPath = this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.index);
		const polyfillUrl = `${this.config.polyfillUrl}?features=${polyfills.join(",")}`;

		return combineLatest(
			this.manifestJsonParser.parse({...sharedRollupOptions, paths: {manifestPath}, tag: output.tag})
				.pipe(
					switchMap(async (manifestJson): Promise<Operation<void>> => {
						if (manifestJson.kind === OperationKind.START) {
							return OPERATION_START();
						}

						this.logger.debugTag(output.tag, `Writing ${chalk.magenta(`${this.config.manifestName}.${this.config.defaultJsonExtension}`)} to disk...`);
						await this.manifestJsonWriter.write({[outputPaths.manifestJson.absolute]: manifestJson.data.result}, {compress: this.shouldCompress(output, buildTaskOptions), ...this.getCompressOptions(output)});

						this.logger.debugTag(output.tag, `Successfully wrote ${chalk.magenta(`${this.config.manifestName}.${this.config.defaultJsonExtension}`)} to disk`);
						return OPERATION_END();
					})
				),
			this.indexHtmlParser.parse({...sharedRollupOptions, tag: output.tag, paths: {indexPath}, globalStyles, polyfillUrl, polyfillContent: `<script crossorigin="anonymous" src="${polyfillUrl}"></script>`})
				.pipe(
					switchMap(async (indexHtml): Promise<Operation<void>> => {
						if (indexHtml.kind === OperationKind.START) {
							return OPERATION_START();
						}

						this.logger.debugTag(output.tag, `Writing ${chalk.magenta(`${this.config.indexName}.${this.config.defaultXMLScriptExtension}`)} to disk...`);
						await this.indexHtmlWriter.write({[outputPaths.indexHtml.absolute]: indexHtml.data.result}, {compress: this.shouldCompress(output, buildTaskOptions), ...this.getCompressOptions(output)});

						this.logger.debugTag(output.tag, `Successfully wrote ${chalk.magenta(`${this.config.indexName}.${this.config.defaultXMLScriptExtension}`)} to disk`);
						return OPERATION_END();
					})
				)
		)
			.pipe(map(([manifestObservable, indexHtmlObservable]) => {
				if (manifestObservable.kind === OperationKind.START || indexHtmlObservable.kind === OperationKind.START) {
					return OPERATION_START();
				}

				return OPERATION_END();
			}));
	}

	/**
	 * Serves the build
	 * @param {IServeOptions} options
	 * @returns {Observable<void>}
	 */
	private serve ({outputPaths, resource, output, buildTaskOptions, index}: IServeOptions): Observable<void> {
		return new Observable<void>(() => {

			this.devServer.onResponseReady((request, response, localRoot) => {
				// If the root is not the same, do nothing
				if (localRoot !== outputPaths().directory.absolute) return;
				const pathWithoutLeadingSlash = request.url.pathname.slice(1);

				// If the path is identical to that of the generated service worker, or if in WATCH mode (which will be if the hashes doesn't change, ever) don't set 'immutable' Cache-Control headers
				if (pathWithoutLeadingSlash === resource().chunk.serviceWorker) {
					response.cacheControl = "no-cache";
				}

			});

			// Attempt to match the user agent when 'index' is requested
			this.devServer.onRequestIndex(index, (userAgent, localRoot) => {

				// If the root is the same and the user agent is matched, return the path to the index.html file from this output
				if (localRoot === outputPaths().directory.absolute && output.match(userAgent)) {
					return {
						path: outputPaths().indexHtml.relative
					};
				}
				return null;
			});

			// Prepare the options to use with the dev server
			const devServerOptions: IDevServerServiceServeOptions = {
				fallbackIndex: () => ({
					path: outputPaths().indexHtml.relative
				}),
				host: output.serve.host,
				port: output.serve.port,
				root: outputPaths().directory.absolute,
				logLevel: buildTaskOptions.debug ? 2 : 1,
				liveReload: {
					activated: buildTaskOptions.reload,
					path: this.config.serveConfig.websocket.liveReloadPath
				},
				cacheControl: buildTaskOptions.watch != null && buildTaskOptions.watch
					? this.config.serveConfig.cacheControl.watch
					: this.config.serveConfig.cacheControl.default
			};

			// Take all existing servers
			const existing = this.devServer.getActiveOptions();
			// Check if there already is a development server for this unique combination of a host, root and directory
			const existsAlready = [...existing].some(option => option.host === devServerOptions.host && option.root === devServerOptions.root && option.port === devServerOptions.port);

			// If not, serve it!
			if (!existsAlready) {
				this.devServer.serve(devServerOptions)
					.then(serverResult => {
						this.logger.logTag(output.tag, `Development server is live on https://${output.serve.host}:${output.serve.port}!`);

						// Listen for 'emit' events and call 'liveReload' when the build has finished, if 'reload' is given in the build options
						if (buildTaskOptions.reload) {
							this.buildEventEmitter.on(BuildStatusKind.BUILT, async () => serverResult.liveReload());
						}
					});
			}

			return () => {
				this.devServer.stop().then();
			};

		});
	}

	/**
	 * Builds theme variables and global styles
	 * @param {IBuildStylesOptions} options
	 * @returns {Observable<Operation<IStylesParserServiceEndResult>>}
	 */
	private buildStyles ({output, buildTaskOptions, project: {foveaCliConfig, root}}: IBuildStylesOptions): Observable<Operation<IStylesParserServiceEndResult>> {
		return this.stylesParser.parse({
			postCSSPlugins: output.postcss == null || output.postcss.additionalPlugins == null ? [] : output.postcss.additionalPlugins,
			root,
			foveaCliConfig,
			tag: output.tag,
			production: buildTaskOptions.production
		});
	}

	/**
	 * Gets the treeshaking options to pass on to Rollup
	 * @param {IFoveaCliOutputConfig} output
	 * @returns {IRollupServiceGenerateOptions["treeshake"]}
	 */
	private getTreeshakingOptions (output: IFoveaCliOutputConfig): IRollupServiceGenerateOptions["treeshake"] {
		if (output.optimization == null || output.optimization.treeshake == null) return undefined;
		if (typeof output.optimization.treeshake === "boolean") return output.optimization.treeshake;

		return {
			pureExternalModules: output.optimization.treeshake.externalDependenciesHasNoSideEffects != null ? output.optimization.treeshake.externalDependenciesHasNoSideEffects : false,
			propertyReadSideEffects: output.optimization.treeshake.readingPropertiesOfObjectsHasNoSideEffects != null ? !output.optimization.treeshake.readingPropertiesOfObjectsHasNoSideEffects : true
		};
	}

	/**
	 * Returns the minify options to use
	 * @param {IFoveaCliOutputConfig} output
	 * @returns {IBabelMinifyOptions}
	 */
	private getMinifyOptions (output: IFoveaCliOutputConfig): IBabelMinifyOptions {
		return output.optimization != null && output.optimization.minify != null && typeof output.optimization.minify !== "boolean"
			? output.optimization.minify
			: this.minifyOptions;
	}

	/**
	 * Returns the compress options to use
	 * @param {IFoveaCliOutputConfig} output
	 * @returns {ICompressionAlgorithmOptions}
	 */
	private getCompressOptions (output: IFoveaCliOutputConfig): ICompressionAlgorithmOptions {
		return output.optimization != null && output.optimization.compress != null && typeof output.optimization.compress !== "boolean"
			? output.optimization.compress
			: this.compressionAlgorithmOptions;
	}

	/**
	 * Gets the options to use with Babel
	 * @param {IFoveaCliOutputConfig} output
	 * @param {IBuildTaskExecuteOptions} buildTaskOptions
	 * @returns {IRollupPostPluginsOptions["babel"]}
	 */
	private getBabelOptions (output: IFoveaCliOutputConfig, buildTaskOptions: IBuildTaskExecuteOptions): IRollupPostPluginsOptions["babel"] {
		const shouldMinify = this.shouldMinify(output, buildTaskOptions);

		/**
		 * Defines the comments configuration option for Babel. Will either set 'comments' or 'shouldPrintComment', depending on the type of the user-provided function
		 */
		const commentConfig = (
			output.optimization == null || output.optimization.comments == null
				// Default to not showing comments
				? {comments: false}
				: typeof output.optimization.comments === "boolean"
				? {comments: output.optimization.comments}
				: {shouldPrintComment: output.optimization.comments}
		);

		return {
			...commentConfig,
			// Default to minifying the build if building for production. If the user has explicitly opted out of minification, do nothing
			minified: shouldMinify,

			// Default to being compact only in production
			compact: shouldMinify,

			additionalPresets: [
				// Minify builds for production unless the user wants to opt-out of it. Use the user-provided minification options if given, otherwise fallback to the ones provided by the CLI
				...(shouldMinify ? [["minify", this.getMinifyOptions(output)]] : []),

				// Use all extra presets provided by the user
				...(output.babel != null && output.babel.additionalPresets != null ? output.babel.additionalPresets : [])
			],

			additionalPlugins: [
				// Use all extra plugins provided by the user
				...(output.babel != null && output.babel.additionalPlugins != null ? output.babel.additionalPlugins : []),
				// Use the "annotate-pure-calls" plugin if the user has set the 'assignedTopLevelCallExpressionsHasNoSideEffects' flag to true
				...(output.optimization != null && output.optimization.treeshake != null && typeof output.optimization.treeshake !== "boolean" && output.optimization.treeshake.assignedTopLevelCallExpressionsHasNoSideEffects === true ? ["annotate-pure-calls"] : [])
			]
		};
	}

	/**
	 * Builds a ServiceWorker
	 * @param {IBuildServiceWorkerOptions} options
	 * @returns {Observable<Operation<IBundlerServiceBundlingEndedResult>>}
	 */
	private buildServiceWorker ({moduleKind, watch, output, outputPaths, sharedRollupOptions, workerPolyfills, project: {root, hash, foveaCliConfig}, buildTaskOptions}: IBuildServiceWorkerOptions): Observable<Operation<IBundlerServiceBundlingEndedResult>> {
		return this.bundler.generate({
			...sharedRollupOptions,
			watch,
			paths: {
				[this.config.serviceWorkerName]: this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.serviceWorker)
			},
			outputPaths,
			sourcemap: this.shouldGenerateSourcemaps(output, buildTaskOptions),
			bundleName: `${this.config.serviceWorkerChunkPrefix}${output.tag}`,
			hash,
			progress: {
				logger: {
					color: this.logger.LOG_COLOR,
					log: this.logger.logTagOnOneLine.bind(this.logger, output.tag),
					clear: this.logger.clearLastLine.bind(this.logger)
				}
			},
			format: moduleKind,
			// Add the Worker polyfills as the intro to the ServiceWorker
			banner: `importScripts("${this.config.polyfillUrl}?features=${workerPolyfills.join(",")}");`,
			footer: output.footer,
			intro: output.intro,
			outro: output.outro,
			browserslist: output.browserslist,
			treeshake: this.getTreeshakingOptions(output),
			babel: this.getBabelOptions(output, buildTaskOptions),
			plugins: [
				...(this.shouldCompress(output, buildTaskOptions) ? [
					// Apply Brotli and Zlib compression
					compressRollupPlugin({
						compressor: this.compressor,
						...this.getCompressOptions(output)
					})
				] : [])
			],
			errorObserver: {
				error: error => this.updateStatus(BuildStatusKind.HOLDING, error)
			}
		});
	}

	/**
	 * Clears the given directory unless it has been cleared previously
	 * @param {string} directory
	 * @param {Set<string>} clearedDirectories
	 * @returns {void}
	 */
	private clearDestinationDirectory (directory: string, clearedDirectories: Set<string>): void {
		// Make sure to clear the destination directory, but only if it hasn't been cleared previously
		if (this.fileLoader.isDirectorySync(directory) && !clearedDirectories.has(directory)) {
			this.logger.verbose(`Clearing bundle destination directory: ${chalk.magenta(directory)}`);
			this.fileSaver.removeSync(directory);
			clearedDirectories.add(directory);
		}
	}

	/**
	 * Prints a status change to the console
	 * @param {BuildStatusKind} status
	 * @param {BuildError<T>} [error]
	 */
	private printStatusChange<T> (status: BuildStatusKind, error?: BuildError<T>): void {
		switch (status) {
			case BuildStatusKind.HOLDING:
				if (error != null) {
					this.logger.logMessageForTag("An error occurred:", error.tag);
					if (error.message != null) {
						this.logger.logMessageForTag(error.message.toString(), error.tag);
					}

					if (error.data != null) {
						this.logger.logMessageForTag(error.data.toString(), error.tag);
					}
				}
				break;
			case BuildStatusKind.BUILDING:
				this.logger.log(`Building app...`);
				break;
			case BuildStatusKind.BUILT:
				this.logger.log(`Successfully built app! (${this.timeSinceLastBuildStatusChange}ms)`);
				break;
		}
	}

	/**
	 * Updates the status of the build
	 * @param {BuildStatusKind} status
	 * @param {BuildError<T>>} [error]
	 */
	private updateStatus<T> (status: BuildStatusKind, error?: BuildError<T>): void {
		if (this.buildStatus === status) return;

		this.printStatusChange(status, error);
		this.timeOfLastBuildStatusChange = Date.now();

		this.buildStatus = status;
		this.buildEventEmitter.emit(status);

		// (Re)throw the error if it is considered fatal
		if (error != null && (!("fatal" in error) || error.fatal)) {
			throw error;
		}
	}
}