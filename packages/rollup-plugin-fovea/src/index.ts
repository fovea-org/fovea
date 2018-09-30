/* tslint:disable:no-default-export */

import {FoveaCompiler, FoveaDiagnostic, IFoveaOptions} from "@fovea/compiler";
import {Plugin, RollupDirOptions, RollupFileOptions, TransformSourceDescription} from "rollup";
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

			if (diagnostics != null) {
				const diags = diagnostics();
				// Invoke the 'onDiagnostics' callback with the diagnostics
				if (inputFoveaOptions.onDiagnostics != null) {
					inputFoveaOptions.onDiagnostics(diags);
				}

				// Otherwise print them unless there are none
				else if (diags.length > 0) {
					console.log(diags.toString());
				}
			}
		},

		/**
		 * Here the source code is parsed and upgraded. A sourcemap will be returned if need be.
		 * @param {string} code
		 * @param {string} file
		 * @returns {Promise<TransformSourceDescription|void>}
		 */
		async transform (code: string, file: string): Promise<TransformSourceDescription|void> {

			// For anything else than @fovea/lib, compile the source code
			const fileResult = await normalizedFoveaOptions.compiler.compile({file, code, options: normalizedFoveaOptions});

			// Lazy-bind a reference to the diagnostics of the result
			diagnostics = () => fileResult.diagnostics;

			// Always return null if nothing changed
			if (!fileResult.hasChanged) return;

			// Finally, return the changed code, the sourcemap (if any), as well as the file dependencies
			return {
				code: fileResult.code,
				map: fileResult.map,
				dependencies: fileResult.statsForFile.fileDependencies
			};
		}
	};
}

// Exports
export {IFoveaRollupPluginOptions} from "./i-fovea-rollup-plugin-options";
export default Fovea;