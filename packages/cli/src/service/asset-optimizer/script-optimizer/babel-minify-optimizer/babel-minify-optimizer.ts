import {IScriptOptimizerOptions} from "../i-script-optimizer-options";
import {IBabelMinifyOptimizer} from "./i-babel-minify-optimizer";
import {OptimizerResult} from "../../i-optimizer-result";
import {ScriptFormatKind} from "../../../../format/script-format-kind";
import {Buffer} from "buffer";
import {IBabelMinifyOptions} from "../../../minify/i-babel-minify-options";

// @ts-ignore
import minify from "babel-minify";

/**
 * A minifier that uses babel as its' underlying implementation
 */
export class BabelMinifyOptimizer implements IBabelMinifyOptimizer {

	constructor (private readonly minifyOptions: IBabelMinifyOptions) {
	}

	/**
	 * Optimizes a Script using babel.
	 * If the script format is unsupported, an un-manipulated Buffer will be returned.
	 * @param {IScriptOptimizerOptions} options
	 * @returns {Promise<OptimizerResult>}
	 */
	public async optimize (options: IScriptOptimizerOptions): Promise<OptimizerResult> {
		return await this.qualifyOptimization(options);
	}

	/**
	 * Qualifies optimizing the given input paths depending on its' kind
	 * @param {IScriptOptimizerOptions} options
	 * @returns {Promise<OptimizerResult>}
	 */
	private async qualifyOptimization (options: IScriptOptimizerOptions): Promise<OptimizerResult> {
		if (options.outputFormat === ScriptFormatKind.JAVASCRIPT) {
			// Only pass supported formats through the optimizer
			return {optimized: true, buffer: await this.runOptimizer(options)};
		}

		return {optimized: false};
	}

	/**
	 * Optimizes (minifies) a Script using babel
	 * @param {IScriptOptimizerOptions} options
	 * @returns {Promise<Buffer>}
	 */
	private async runOptimizer (options: IScriptOptimizerOptions): Promise<Buffer> {
		return Buffer.from(this.minify(options.buffer));
	}

	/**
	 * Minifies the given code
	 * @returns {string}
	 */
	private minify (content: string|Buffer): string {
		const {code} = minify(content.toString(), this.minifyOptions, {sourceMaps: false});
		return code;
	}
}