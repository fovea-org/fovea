import {IScriptOptimizerOptions} from "../i-script-optimizer-options";
import {ICombinedScriptOptimizer} from "./i-combined-script-optimizer";
import {IBabelMinifyOptimizer} from "../babel-minify-optimizer/i-babel-minify-optimizer";
import {IScriptOptimizer} from "../i-script-optimizer";
import {ILoggerService} from "../../../logger/i-logger-service";
import {OptimizerResult} from "../../i-optimizer-result";

/**
 * A Script optimizer that combines other Script optimizers to produce a buffer
 */
export class CombinedScriptOptimizer implements ICombinedScriptOptimizer {

	constructor (private readonly buildLogger: ILoggerService,
							 private readonly babelMinifyOptimizer: IBabelMinifyOptimizer) {
	}

	/**
	 * Optimizes a script using any of the embedded optimizers.
	 * If the script format is unsupported, an un-manipulated Buffer will be returned.
	 * @param {IScriptOptimizerOptions} options
	 * @returns {Promise<OptimizerResult>}
	 */
	public async optimize (options: IScriptOptimizerOptions): Promise<OptimizerResult> {
		return await this.qualifyOptimization(options, [this.babelMinifyOptimizer]);
	}

	/**
	 * Qualifies optimizing the given input. Will pass it through the given optimizers until
	 * one of them successfully encodes it.
	 * @param {IScriptOptimizerOptions} options
	 * @param {IScriptOptimizer[]} optimizers
	 * @returns {Promise<OptimizerResult>}
	 */
	private async qualifyOptimization (options: IScriptOptimizerOptions, optimizers: IScriptOptimizer[]): Promise<OptimizerResult> {

		for (const optimizer of optimizers) {
			const result = await optimizer.optimize(options);
			if (result.optimized) return result;
		}
		this.buildLogger.debug(`No script optimizer could optimize file:`, options.path);
		return {optimized: false};
	}
}