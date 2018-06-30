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
import {IObserver} from "../../observable/i-observer";
import {IBuildStylesOptions} from "./i-build-styles-options";
import {IStylesParserServiceResult} from "../../service/parser/styles-parser/i-styles-parser-service-result";
import {IBuildOutputOptions} from "./i-build-output-options";
import {IBuildOutputFilesOptions} from "./i-build-output-files-options";
import {IBuildOutputBundleOptions} from "./i-build-output-bundle-options";
import {IBuildOutputFromStylesOptions} from "./i-build-output-from-styles-options";
import {IBuildServiceWorkerResult} from "./i-build-service-worker-result";
import {EventEmitter} from "events";
import {BuildStatusKind} from "./build-status-kind";
import {ISubscriber} from "../../observable/i-subscriber";
import {IBundlerServiceBundlingEndedData} from "../../service/bundler/i-bundler-service-bundling-ended-data";
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
import {ISubscriberError} from "../../observable/i-subscriber-error";
import {IEnvironmentDefaults} from "../../environment/i-environment-defaults";
import {buildEnvironment} from "../../build-environment/build-environment";

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

		let observer: IObserver|null = this.build(
			{buildTaskOptions, clearedDirectories},
			{
				onError: error => {
					this.updateStatus(BuildStatusKind.HOLDING, error);

					// Unobserve the project immediately if the error is fatal
					if (error.fatal) {
						if (observer != null) {
							observer.unobserve();
							observer = null;
						}
					}
				},
				onStart: () => {
					this.updateStatus(BuildStatusKind.BUILDING);
				},
				onEnd: () => {
					// Update the status of the build
					this.updateStatus(BuildStatusKind.BUILT);

					// Unobserve the project immediately if not in watch mode
					if (!buildTaskOptions.watch) {
						if (observer != null) {
							observer.unobserve();
							observer = null;
						}
					}
				}
			});
	}

	/**
	 * Begins the built
	 * @param {IBuildTaskExecuteOptions} options
	 * @param {ISubscriber<void>} subscriber
	 * @returns {IObserver}
	 */
	private build (options: IBuildOptions, subscriber: ISubscriber<void>): IObserver {
		let buildObserver: IObserver|null = null;

		// Subscribe for changes to the project and re-build every time it changes
		let projectObserver: IObserver|null = this.projectParser.parse(options.buildTaskOptions, {
			onError: error => {
				subscriber.onError(error);
			},
			onStart: () => {
				subscriber.onStart();
			},
			onEnd: async project => {
				// Break if the observer has been unobserved in the meantime
				if (returnObserver.unobserved) {
					return;
				}

				// Make sure to unobserve from any existing project observer
				if (buildObserver != null) {
					buildObserver.unobserve();
				}

				this.logger.verbose(`Successfully read ${chalk.magenta(this.config.foveaCliConfigName)} and ${chalk.magenta("package.json")} files!`);

				buildObserver = this.buildProject(
					{...options, project},
					{
						onError: subscriber.onError,
						onStart: subscriber.onStart,
						onEnd: subscriber.onEnd
					}
				);
			}
		});

		const returnObserver = {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				if (projectObserver != null) {
					projectObserver.unobserve();
					projectObserver = null;
				}
				if (buildObserver != null) {
					buildObserver.unobserve();
					buildObserver = null;
				}
			}
		};

		return returnObserver;
	}

	/**
	 * Called each time the project changes
	 * @param {IBuildProjectOptions} options
	 * @param {ISubscriber<void>} subscriber
	 * @returns {IObserver}
	 */
	private buildProject (options: IBuildProjectOptions, subscriber: ISubscriber<void>): IObserver {
		let outputsObserver: IObserver|null = null;

		let assetsObserver: IObserver|null = this.buildAssets(
			options,
			{
				onError: error => {
					subscriber.onError(error);
				},
				onStart: () => {
					// Unobserve from child observers immediately when 'onStart()' is called, if any of them is currently active
					if (outputsObserver != null) {
						outputsObserver.unobserve();
						outputsObserver = null;
					}
					subscriber.onStart();
				},
				onEnd: assets => {
					// Break if the observer has been unobserved in the meantime
					if (returnObserver.unobserved) {
						return;
					}

					// Make sure to unobserve any potential existing observer for outputs
					if (outputsObserver != null) {
						outputsObserver.unobserve();
						outputsObserver = null;
					}

					this.logger.verbose(`Successfully built assets!`);

					outputsObserver = this.buildOutputs(
						{...options, assets},
						{
							onError: error => {
								subscriber.onError(error);
							},
							onStart: () => {
								subscriber.onStart();
							},
							onEnd: () => {
								// Break if the observer has been unobserved in the meantime
								if (returnObserver.unobserved) {
									return;
								}

								this.logger.verbose(`Successfully built all outputs!`);
								subscriber.onEnd(undefined);
							}
						}
					);
				}
			}
		);

		// Return an observer
		const returnObserver = {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				if (assetsObserver != null) {
					assetsObserver.unobserve();
					assetsObserver = null;
				}
				if (outputsObserver != null) {
					outputsObserver.unobserve();
					outputsObserver = null;
				}
			}
		};
		return returnObserver;
	}

	/**
	 * Builds assets and proceeds with the rest of the build
	 * @param {IBuildAssetsOptions} options
	 * @param {ISubscriber<IAssetOptimizerServiceOptimizeDirectoryResult>} subscriber
	 * @returns {IObserver}
	 */
	private buildAssets ({project, buildTaskOptions}: IBuildAssetsOptions, subscriber: ISubscriber<IAssetOptimizerServiceOptimizeDirectoryResult>): IObserver {
		const {foveaCliConfig, root} = project;

		subscriber.onStart();

		// Parse and watch the assets directory
		let assetsObserver: IObserver|null = this.assetParser.parse(
			{project, watch: buildTaskOptions.watch},
			{
				onError: error => {
					subscriber.onError(error);
				},
				onStart: () => {
					subscriber.onStart();
				},
				onEnd: async ({assetMap, appIcon}) => {
					// Break if the observer has been unobserved in the meantime
					if (returnObserver.unobserved) {
						return;
					}

					this.logger.verbose(`Successfully read assets and app icon!`);

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
					subscriber.onEnd(assets);
				}
			}
		);

		// Return an observer
		const returnObserver = {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				if (assetsObserver != null) {
					assetsObserver.unobserve();
					assetsObserver = null;
				}
			}
		};
		return returnObserver;
	}

	/**
	 * Builds all outputs
	 * @param {IBuildProjectOptions} options
	 * @param {ISubscriber<void>} subscriber
	 * @returns {IObserver}
	 */
	private buildOutputs (options: IBuildOutputsOptions, subscriber: ISubscriber<void>): IObserver {
		const {foveaCliConfig} = options.project;
		let outputObservers: IObserver[] = [];
		// noinspection JSMismatchedCollectionQueryUpdate
		const builtOutputs: Set<IFoveaCliOutputConfig> = new Set();
		subscriber.onStart();

		// Normalize the outputs based on the CLI config
		const outputs: IFoveaCliOutputConfig[] = Array.isArray(foveaCliConfig.output) ? foveaCliConfig.output : [foveaCliConfig.output];

		// Only use those outputs that should not be disabled in watch mode - if this build is for watch mode
		const filteredOutputs = outputs.filter(output => {
			// Make sure that the output is not disabled
			if (typeof output.disable === "boolean") return !output.disable;
			// If in watch mode, make sure the output is not disabled in watch mode
			if (options.buildTaskOptions.watch) return output.disable !== "watch";
			// Accept it!
			return true;
		});

		// Loop through all of the outputs in parallel
		filteredOutputs.forEach((output, index) => {
			const outputObserver = this.buildOutput(
				{...options, output, index},
				{
					onError: error => {
						subscriber.onError(error);
					},
					onStart: () => {
						subscriber.onStart();
					},
					onEnd: () => {
						if (returnObserver.unobserved) return;

						this.logger.logTag(output.tag, `Successfully built ${chalk.magenta(output.tag)}!`);
						builtOutputs.add(output);

						// If all outputs have been built, invoke the callback
						if (builtOutputs.size === filteredOutputs.length) {
							// The project was successfully built
							subscriber.onEnd(undefined);
						}
					}
				}
			);
			outputObservers.push(outputObserver);
		});

		// Prepare a observer
		const returnObserver = {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				outputObservers.forEach(outputObserver => {
					outputObserver.unobserve();
				});
				outputObservers = [];
				builtOutputs.clear();
			}
		};

		// Return the observer
		return returnObserver;
	}

	/**
	 * Builds an output from an IFoveaCliConfig
	 * @param {IBuildOutputOptions} options
	 * @param {ISubscriber<void>} subscriber
	 * @returns {IObserver}
	 */
	private buildOutput (options: IBuildOutputOptions, subscriber: ISubscriber<void>): IObserver {
		const {output, assets, clearedDirectories, project} = options;
		const {foveaCliConfig, root, hash} = project;
		let restOfBuildObserver: IObserver|null = null;
		let stylesObserver: IObserver|null = null;
		subscriber.onStart();

		// Get all output paths
		const outputPaths = this.projectPathUtil.getOutputPathsForOutput({
			root,
			foveaCliConfig,
			assets,
			hash,
			output
		});

		this.clearDestinationDirectory(outputPaths.directory.absolute, clearedDirectories);

		// Generate the theme variables and global styles content
		stylesObserver = this.buildStyles(
			options,
			{
				onError: error => {
					subscriber.onError(error);
				},
				onStart: () => {
					if (restOfBuildObserver != null) {
						restOfBuildObserver.unobserve();
						restOfBuildObserver = null;
					}
					subscriber.onStart();
				},
				onEnd: styles => {
					// Break if the observer has been unobserved in the meantime
					if (returnObserver.unobserved) {
						return;
					}

					// Clear any existing observer for the rest of the build
					if (restOfBuildObserver != null) {
						restOfBuildObserver.unobserve();
					}

					this.logger.verboseTag(output.tag, `Successfully built styles!`);
					// Prepare a new observer for the rest of the build
					restOfBuildObserver = this.buildOutputFromStyles(
						{...options, styles, outputPaths},
						{
							onError: error => {
								subscriber.onError(error);
							},
							onStart: () => {
								subscriber.onStart();
							},
							onEnd: value => {
								// Break if the observer has been unobserved in the meantime
								if (returnObserver.unobserved) {
									return;
								}

								subscriber.onEnd(value);
							}
						}
					);
				}
			}
		);

		// Return an observer
		const returnObserver = {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				if (stylesObserver != null) {
					stylesObserver.unobserve();
					stylesObserver = null;
				}

				if (restOfBuildObserver != null) {
					restOfBuildObserver.unobserve();
					restOfBuildObserver = null;
				}
			}
		};
		return returnObserver;

	}

	/**
	 * Builds anything but the styles for a bundle
	 * @param {IBuildOutputFromStylesOptions} options
	 * @param {ISubscriber<void>} subscriber
	 * @returns {Promise<IObserver>}
	 */
	private buildOutputFromStyles (options: IBuildOutputFromStylesOptions, subscriber: ISubscriber<void>): IObserver {
		const {output, outputPaths, project, buildTaskOptions, assets, styles: {globalStyles, themeVariables}} = options;
		const {foveaCliConfig, hash, root, packageJson} = project;
		let builtOutputBundle: boolean = false;
		let builtOutputFiles: boolean = false;
		let hasServed: boolean = false;

		const beforeEnd = async () => {
			// Assert that everything has been built
			if (!builtOutputBundle || !builtOutputFiles) return;

			this.logger.verboseTag(output.tag, `Writing assets to disk`);
			await this.assetWriter.write(
				Object.assign({},
					...Object.entries(outputPaths.asset.appIcon).map(([key, path]) => ({[path.absolute]: assets.appIconMap[key]})),
					...Object.entries(outputPaths.asset.other).map(([key, path]) => ({[path.absolute]: assets.assetMap[key]}))
				), {production: buildTaskOptions.production});

			this.logger.verboseTag(output.tag, `Successfully wrote all assets to disk!`);

			// Serve the build if requested and if no development server has been served previously
			if (!hasServed && buildTaskOptions.serve != null && buildTaskOptions.serve) {
				hasServed = true;
				this.logger.verboseTag(output.tag, `Serving bundle...`);
				await this.serve({
					index: options.index,
					buildTaskOptions,
					output,
					resource: () => resource.output,
					outputPaths: () => outputPaths
				});
			}

			subscriber.onEnd(undefined);
		};

		subscriber.onStart();

		// Prepare the IResource
		const resource: IResource = {
			style: {
				themeVariables
			},
			output: this.projectPathUtil.getOutputResourceFromOutputPath(outputPaths, [])
		};

		// Whether or not to use ES-modules depend on the given browserslist. If none is given, ES modules *will* be used. Otherwise, it will fall back to SystemJS for browsers without support
		const moduleKind: ModuleFormat = output.browserslist == null || browserslistSupportsFeatures(output.browserslist, "es6-module") ? "es" : "system";
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

		// Build the bundles and obtain an observer for them
		let bundleObserver: IObserver|null = this.buildOutputBundle(
			{...options, workerPolyfills, resource, additionalEnvironmentVariables, moduleKind, sharedRollupOptions},
			{
				onError: error => {
					subscriber.onError(error);
				},
				onStart: () => {
					subscriber.onStart();
				},
				onEnd: () => {
					// Break if the observer has been unobserved in the meantime
					if (returnObserver.unobserved) {
						return;
					}

					this.logger.verboseTag(output.tag, `Successfully generated bundle!`);
					builtOutputBundle = true;
					// noinspection JSIgnoredPromiseFromCall
					beforeEnd();
				}
			}
		);

		// Build all additional output files
		let outputFilesObserver: IObserver|null = this.buildOutputFiles(
			{...options, polyfills, globalStyles, sharedRollupOptions},
			{
				onError: error => {
					subscriber.onError(error);
				},
				onStart: () => {
					subscriber.onStart();
				},
				onEnd: () => {
					// Break if the observer has been unobserved in the meantime
					if (returnObserver.unobserved) {
						return;
					}

					this.logger.verboseTag(output.tag, `Successfully built ${chalk.magenta(`${this.config.indexName}.${this.config.defaultXMLScriptExtension}`)} and ${chalk.magenta(`${this.config.manifestName}.${this.config.defaultJsonExtension}`)} files!`);
					builtOutputFiles = true;
					// noinspection JSIgnoredPromiseFromCall
					beforeEnd();
				}
			}
		);

		// Return an observer
		const returnObserver = {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				if (bundleObserver != null) {
					bundleObserver.unobserve();
					bundleObserver = null;
				}
				if (outputFilesObserver != null) {
					outputFilesObserver.unobserve();
					outputFilesObserver = null;
				}
			}
		};
		return returnObserver;
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
	 * Builds the bundle for an output
	 * @param {IBuildOutputBundleOptions} options
	 * @param {ISubscriber<void>} subscriber
	 * @returns {IObserver}
	 */
	private buildOutputBundle (options: IBuildOutputBundleOptions, subscriber: ISubscriber<void>): IObserver {
		const {sharedRollupOptions, outputPaths, output, buildTaskOptions, moduleKind, additionalEnvironmentVariables, resource, project} = options;
		const {root, hash, foveaCliConfig} = project;
		let builtMainBundle: boolean = false;
		let serviceWorkerObserver: IBuildServiceWorkerResult|null = null;
		subscriber.onStart();

		let hasPrintedDiagnostics: boolean = false;
		let hasHadError: boolean = false;

		// Generate the main bundle
		let mainBundleObserver: IObserver|null = this.bundler.generate({
				...sharedRollupOptions,
				paths: {
					[this.config.entryName]: this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.entry)
				},
				outputPaths,
				bundleName: output.tag,
				hash,
				context: "window",
				browserslist: output.browserslist,
				additionalBabelPresets: buildTaskOptions.production ? [["minify", this.minifyOptions]] : [],
				additionalBabelPlugins: [],
				format: moduleKind,
				watch: buildTaskOptions.watch,
				plugins: [
					Fovea({
						production: buildTaskOptions.production,
						exclude: foveaCliConfig.exclude,
						onDiagnostics: diagnostics => {
							// Only proceed if there are any relevant diagnostics
							if (!hasPrintedDiagnostics && diagnostics.length > 0) {
								hasPrintedDiagnostics = true;

								// If any of the diagnostics is an error, invoke the 'onError' subscriber
								if (diagnostics.some(diagnostic => diagnostic.degree === FoveaDiagnosticDegree.ERROR)) {
									hasHadError = true;
									subscriber.onError({
										tag: output.tag,
										data: diagnostics,
										fatal: false
									});
								}

								// Otherwise, print it
								else {
									this.logger.logTag(output.tag, diagnostics.toString());
								}
							}
						},
						postcss: {
							plugins: output.postCSSPlugins == null ? [] : output.postCSSPlugins,
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
					...(buildTaskOptions.production ? [
						// Apply Brotli and Zlib compression
						compressRollupPlugin({
							compressor: this.compressor
						})
					] : [])
				],
				observer: {
					onError: error => {
						subscriber.onError({...error, tag: output.tag});
					},
					onStart: () => {
						hasPrintedDiagnostics = false;
						hasHadError = false;
						subscriber.onStart();
					},
					onEnd: async ({generatedChunkNames}) => {
						// Break if the observer has been unobserved in the meantime
						if (returnObserver.unobserved || hasHadError) {
							return;
						}

						builtMainBundle = true;

						// Refresh the IResource and 'RESOURCE' environment variable
						resource.output = this.projectPathUtil.getOutputResourceFromOutputPath(outputPaths, generatedChunkNames);
						additionalEnvironmentVariables.RESOURCE = JSON.stringify(resource);

						if (serviceWorkerObserver == null) {
							serviceWorkerObserver = this.buildServiceWorker({
								...options,
								watch: buildTaskOptions.watch
							}, {
								onError: error => {
									subscriber.onError(error);
								},
								onStart: () => {
									subscriber.onStart();
								},
								onEnd: () => {
									// Break if the observer has been unobserved in the meantime
									if (returnObserver.unobserved) {
										return;
									}

									if (builtMainBundle) {
										subscriber.onEnd(undefined);
									}
								}
							});
						}

						else {
							// Break if the observer has been unobserved in the meantime
							if (returnObserver.unobserved) {
								return;
							}
							// Force recompilation of the ServiceWorker observer
							serviceWorkerObserver.trigger();
						}
					}
				}
			}
		);

		// Return an observer
		const returnObserver = {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				if (mainBundleObserver != null) {
					mainBundleObserver.unobserve();
					mainBundleObserver = null;
				}
				if (serviceWorkerObserver != null) {
					serviceWorkerObserver.unobserve();
					serviceWorkerObserver = null;
				}
			}
		};
		return returnObserver;
	}

	/**
	 * Builds all output files that isn't styles and isn't bundles, such as index.html and manifest.json
	 * @param {IBuildOutputFilesOptions} options
	 * @param {ISubscriber<void>} subscriber
	 * @returns {void}
	 */
	private buildOutputFiles ({project: {foveaCliConfig, root}, buildTaskOptions, outputPaths, sharedRollupOptions, globalStyles, polyfills, output}: IBuildOutputFilesOptions, subscriber: ISubscriber<void>): IObserver {
		const manifestPath = this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.manifest);
		const indexPath = this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.index);
		let builtManifest: boolean = false;
		let builtIndex: boolean = false;
		subscriber.onStart();

		// Subscribe to the manifest.json.ts file and write it to disk each time it changes
		let manifestJsonObserver: IObserver|null = this.manifestJsonParser.parse(
			{...sharedRollupOptions, paths: {manifestPath}, watch: buildTaskOptions.watch},
			{
				onError: error => {
					subscriber.onError(error);
				},
				onStart: () => {
					this.logger.verboseTag(output.tag, `Building ${chalk.magenta(`${this.config.manifestName}.${this.config.defaultJsonExtension}`)}...`);
					subscriber.onStart();
				},
				onEnd: async manifestJson => {
					// Break if the observer has been unobserved in the meantime
					if (returnObserver.unobserved) {
						return;
					}
					await this.manifestJsonWriter.write({[outputPaths.manifestJson.absolute]: manifestJson.result}, {production: buildTaskOptions.production});

					builtManifest = true;
					if (builtIndex) {
						subscriber.onEnd(undefined);
					}
				}
			}
		);

		// Subscribe to the index.html.ts file and write it to disk each time it changes
		const polyfillUrl = `${this.config.polyfillUrl}?features=${polyfills.join(",")}`;
		let indexHtmlObserver: IObserver|null = this.indexHtmlParser.parse(
			{...sharedRollupOptions, paths: {indexPath}, watch: buildTaskOptions.watch, globalStyles, polyfillUrl, polyfillContent: `<script crossorigin="anonymous" src="${polyfillUrl}"></script>`},
			{
				onError: error => {
					subscriber.onError(error);
				},
				onStart: () => {
					this.logger.verboseTag(output.tag, `Building ${chalk.magenta(`${this.config.indexName}.${this.config.defaultXMLScriptExtension}`)}...`);
					subscriber.onStart();
				},
				onEnd: async indexHtml => {
					// Break if the observer has been unobserved in the meantime
					if (returnObserver.unobserved) {
						return;
					}
					await this.indexHtmlWriter.write({[outputPaths.indexHtml.absolute]: indexHtml.result}, {production: buildTaskOptions.production});

					builtIndex = true;
					if (builtManifest) {
						subscriber.onEnd(undefined);
					}
				}
			}
		);

		// Return an observer
		const returnObserver = {
			unobserved: false,
			unobserve () {
				this.unobserved = true;
				if (manifestJsonObserver != null) {
					manifestJsonObserver.unobserve();
					manifestJsonObserver = null;
				}
				if (indexHtmlObserver != null) {
					indexHtmlObserver.unobserve();
					indexHtmlObserver = null;
				}
			}
		};
		return returnObserver;
	}

	/**
	 * Serves the build
	 * @param {IServeOptions} options
	 * @returns {Promise<void>}
	 */
	private async serve ({outputPaths, resource, output, buildTaskOptions, index}: IServeOptions): Promise<void> {

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
			const serverResult = await this.devServer.serve(devServerOptions);
			this.logger.logTag(output.tag, `Development server is live on https://${output.serve.host}:${output.serve.port}!`);

			// Listen for 'emit' events and call 'liveReload' when the build has finished, if 'reload' is given in the build options
			if (buildTaskOptions.reload) {
				this.buildEventEmitter.on(BuildStatusKind.BUILT, async () => serverResult.liveReload());
			}
		}
	}

	/**
	 * Builds theme variables and global styles
	 * @param {IBuildStylesOptions} options
	 * @param {ISubscriber<IStylesParserServiceResult>} subscriber
	 * @returns {IObserver}
	 */
	private buildStyles ({output, buildTaskOptions, project: {foveaCliConfig, root}}: IBuildStylesOptions, subscriber: ISubscriber<IStylesParserServiceResult>): IObserver {
		// Generate the theme variables and global styles content
		const returnObserver = this.stylesParser.parse({
			watch: buildTaskOptions.watch,
			postCSSPlugins: output.postCSSPlugins == null ? [] : output.postCSSPlugins,
			root,
			foveaCliConfig,
			production: buildTaskOptions.production
		}, {
			onError: error => {
				subscriber.onError(error);
			},
			onStart: () => {
				this.logger.verboseTag(output.tag, `Building styles...`);
				subscriber.onStart();
			},
			onEnd: value => {
				// Break if the observer has been unobserved in the meantime
				if (returnObserver.unobserved) {
					return;
				}

				subscriber.onEnd(value);
			}
		});

		return returnObserver;
	}

	/**
	 * Builds a ServiceWorker
	 * @param {IBuildServiceWorkerOptions} options
	 * @param {ISubscriber<IBundlerServiceBundlingEndedData>} subscriber
	 * @returns {IBuildServiceWorkerResult}
	 */
	private buildServiceWorker ({moduleKind, watch, output, outputPaths, sharedRollupOptions, workerPolyfills, project: {root, hash, foveaCliConfig}, buildTaskOptions}: IBuildServiceWorkerOptions, subscriber: ISubscriber<IBundlerServiceBundlingEndedData>): IBuildServiceWorkerResult {
		// Generate the Service Worker
		const generateBundle = (shouldWatch: boolean): IObserver => {
			let bundleObserver: IObserver|null = this.bundler.generate({
				...sharedRollupOptions,
				watch: shouldWatch,
				paths: {
					[this.config.serviceWorkerName]: this.projectPathUtil.getPathFromProjectRoot(root, foveaCliConfig.serviceWorker)
				},
				outputPaths,
				bundleName: `${this.config.serviceWorkerChunkPrefix}${output.tag}`,
				hash,
				format: moduleKind,
				// Add the Worker polyfills as the intro to the ServiceWorker
				banner: `importScripts("${this.config.polyfillUrl}?features=${workerPolyfills.join(",")}");`,
				browserslist: output.browserslist,
				additionalBabelPresets: buildTaskOptions.production ? [["minify", this.minifyOptions]] : [],
				observer: {
					onError: error => {
						subscriber.onError(error);
					},
					onStart: () => {
						subscriber.onStart();
					},
					onEnd: result => {
						// Break if the observer has been unobserved in the meantime
						if (returnObserver.unobserved) {
							return;
						}

						subscriber.onEnd(result);
						if (!shouldWatch) {
							if (bundleObserver != null) {
								bundleObserver.unobserve();
								bundleObserver = null;
							}
						}
					}
				}
			});

			return bundleObserver;
		};

		const returnObserver = {
			...generateBundle(watch),
			trigger: () => generateBundle(false)
		};
		return returnObserver;
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
	 * @param {ISubscriberError<T>} [error]
	 */
	private printStatusChange<T> (status: BuildStatusKind, error?: ISubscriberError<T>): void {
		switch (status) {
			case BuildStatusKind.HOLDING:
				const defaultErrorMessage = `An error occurred:`;
				let errorMessage = defaultErrorMessage;

				if (error != null) {
					if (error.data == null) {
						errorMessage += `\nUnknown error`;
					}
					else if ("stack" in error.data) {
						errorMessage += `\n${(<any>error).data.stack.toString()}}`;
					}

					else {
						errorMessage += `\n${error.data.toString()}}`;
					}
				}

				// Print the error message
				error == null || error.tag == null
					? this.logger.log(errorMessage)
					: this.logger.logTag(error.tag, errorMessage);
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
	 * @param {ISubscriberError<T>>} [error]
	 */
	private updateStatus<T> (status: BuildStatusKind, error?: ISubscriberError<T>): void {
		if (this.buildStatus === status) return;

		this.printStatusChange(status, error);
		this.timeOfLastBuildStatusChange = Date.now();

		this.buildStatus = status;
		this.buildEventEmitter.emit(status);
	}
}