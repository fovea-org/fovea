/* tslint:disable:no-default-export */
/* tslint:disable:no-any */
/* tslint:disable:no-duplicate-imports */

import {FoveaCompiler, FoveaDiagnostic, IFoveaCompiler, IFoveaOptions} from "@fovea/compiler";
import * as rollup from "rollup";
import {Plugin, RollupDirOptions, RollupFileOptions, SourceDescription} from "rollup";
import {IFoveaRollupPluginOptions} from "./i-fovea-rollup-plugin-options";

/**
 * The name of the plugin
 * @type {string}
 */
const PLUGIN_NAME = "Fovea";

/**
 * Keep a reference to the Node environment
 */
const env = process.env;
const nodeEnv = env.NODE_ENV;

/**
 * A Regular Expression to match files representing @fovea/lib
 * @type {RegExp}
 */
const FOVEA_LIB_REGEX = /@fovea\/lib/;

/**
 * Performs a dry-run with the given compiler. This is to ensure that we calculate stats
 * for every file before performing the last optimizations
 * @param {IFoveaCompiler} compiler
 * @param {Partial<IFoveaOptions>} foveaOptions
 * @param {RollupFileOptions|RollupDirOptions} options
 * @returns {Promise<void>}
 */
async function performDryRun (compiler: IFoveaCompiler, foveaOptions: Partial<IFoveaOptions>, options: RollupFileOptions|RollupDirOptions): Promise<void> {
	// Normalize all plugins
	const plugins = <Plugin[]> (Array.isArray(options.plugins) ? options.plugins : [options.plugins]);
	// Make a copy of the plugins
	const pluginsCopy = [...plugins];

	// Take the Fovea plugin index from the existing plugins. We want to replace it with a clean copy
	const foveaPluginIndex = pluginsCopy.findIndex(plugin => plugin.name === PLUGIN_NAME);

	// Replace the plugin with a new one with a 'optimize' value forced to 'false' (to ensure no infinite recursion)
	// and a 'dryRun' value forced to 'true' (to ensure no duplicate mutations to the SourceFiles)
	pluginsCopy[foveaPluginIndex] = <Plugin><any> Fovea({...foveaOptions, compiler, optimize: false, dryRun: true});

	// Perform a dry-run. Wrap it try-catch to silence Typescript diagnostics
	try {
		await rollup.rollup(<RollupFileOptions>{
			...options,
			plugins: pluginsCopy
		});
	} catch {
	}
}

/**
 * The base transformer for Fovea.
 * @param {Partial<IFoveaRollupPluginOptions>?} [inputFoveaOptions]
 * @author Frederik Wessberg
 */
function Fovea (inputFoveaOptions: Partial<IFoveaRollupPluginOptions> = {}): Plugin {

	/**
	 * The normalized FoveaOptions to use
	 * @type IFoveaOptions}
	 */
	const normalizedFoveaOptions: IFoveaOptions = {
		dryRun: inputFoveaOptions.dryRun == null ? false : inputFoveaOptions.dryRun,
		exclude: inputFoveaOptions.exclude == null ? [] : inputFoveaOptions.exclude,
		optimize: inputFoveaOptions.optimize == null ? true : inputFoveaOptions.optimize,
		compiler: inputFoveaOptions.compiler == null ? new FoveaCompiler() : inputFoveaOptions.compiler,
		production: inputFoveaOptions.production == null ? nodeEnv == null ? false : nodeEnv.toLowerCase() === "production" : inputFoveaOptions.production,
		postcss: inputFoveaOptions.postcss == null ? {} : inputFoveaOptions.postcss
	};

	/**
	 * The options that Rollup has been configured with
	 * @type {RollupFileOptions|RollupDirOptions}
	 */
	let rollupOptions: RollupFileOptions|RollupDirOptions;

	/**
	 * Returns true if the first build is currently in progress
	 * @type {boolean}
	 */
	let isFirstBuild = true;

	/**
	 * Whether or not a dry run has run
	 * @type {boolean}
	 */
	let hasPerformedDryRun = false;

	/**
	 * Checks if Rollup is in WATCH mode
	 * @returns {boolean}
	 */
	const isInWatchMode = () => process.env.ROLLUP_WATCH != null;

	/**
	 * Holds the current diagnostics
	 * @type {FoveaDiagnostic[]|null}
	 */
	let diagnostics: (() => FoveaDiagnostic[])|null = null;

	return {
		name: PLUGIN_NAME,

		/**
		 * Called when Rollup has received options.
		 * @param {RollupFileOptions|RollupDirOptions} rawRollupOptions
		 */
		options (rawRollupOptions: RollupFileOptions|RollupDirOptions): RollupFileOptions|RollupDirOptions {
			rollupOptions = rawRollupOptions;
			return rollupOptions;
		},

		/**
		 * Called when a bundle has been generated.
		 */
		ongenerate (): void {

			// If we're in a dry run, do nothing
			if (normalizedFoveaOptions.dryRun) {
				return;
			}

			isFirstBuild = false;

			if (diagnostics != null) {
				// Invoke the 'onDiagnostics' callback with the diagnostics
				if (inputFoveaOptions.onDiagnostics != null) {
					inputFoveaOptions.onDiagnostics(diagnostics());
				}
			}
		},

		/**
		 * Here the source code is parsed and upgraded. A sourcemap will be returned if need be.
		 * @param {string} code
		 * @param {string} file
		 * @returns {Promise<SourceDescription|void>}
		 */
		async transform (code: string, file: string): Promise<SourceDescription|void> {

			// If 'optimize' is on, we need to perform a full two compile runs.
			// The first is to calculate the correct IFoveaStats. The second is then the actual one.
			// This is because we don't decide the order in which rollup will invoke this plugin with files
			// Instead, we make sure to traverse all files to ensure that we have right stats before proceeding.
			if (isFirstBuild && !hasPerformedDryRun && normalizedFoveaOptions.optimize && !isInWatchMode()) {
				hasPerformedDryRun = true;
				await performDryRun(normalizedFoveaOptions.compiler, normalizedFoveaOptions, rollupOptions);
			}

			// Check if the file is @fovea/lib
			const isFoveaLib = FOVEA_LIB_REGEX.test(file);

			// If the file is @fovea/lib
			if (isFoveaLib) {
				// If we're not in a dry run, transform compiler hints - unless we're in WATCH mode. It only works for full builds
				if (!normalizedFoveaOptions.dryRun && !isInWatchMode()) {
					return normalizedFoveaOptions.compiler.transformCompilerHints(code, file);
				}
				// Otherwise, do nothing
				return undefined;
			}

			// For anything else than @fovea/lib, compile the source code
			const fileResult = await normalizedFoveaOptions.compiler.compile({file, code, options: normalizedFoveaOptions});

			// Lazy-bind a reference to the diagnostics of the result
			diagnostics = () => fileResult.diagnostics;

			// Always return null if nothing changed
			if (!fileResult.hasChanged) return;

			// Finally, return the changed code as well as the sourcemap
			return fileResult;
		}
	};
}

// Exports
export {IFoveaRollupPluginOptions} from "./i-fovea-rollup-plugin-options";
export default Fovea;
export {Fovea};