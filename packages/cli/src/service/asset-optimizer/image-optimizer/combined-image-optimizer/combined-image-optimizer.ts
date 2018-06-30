import {IImageOptimizerOptions} from "../i-image-optimizer-options";
import {ICombinedImageOptimizer} from "./i-combined-image-optimizer";
import {ISharpImageOptimizer} from "../sharp-image-optimizer/i-sharp-image-optimizer";
import {ISvgoImageOptimizer} from "../svgo-image-optimizer/i-svgo-image-optimizer";
import {IImageOptimizer} from "../i-image-optimizer";
import {ILoggerService} from "../../../logger/i-logger-service";
import {OptimizerResult} from "../../i-optimizer-result";
import {IIcoImageOptimizer} from "../ico-image-optimizer/i-ico-image-optimizer";

/**
 * An Image optimizer combines other image optimizers to produce a buffer
 */
export class CombinedImageOptimizer implements ICombinedImageOptimizer {

	constructor (private readonly buildLogger: ILoggerService,
							 private readonly sharpImageOptimizer: ISharpImageOptimizer,
							 private readonly svgoImageOptimizer: ISvgoImageOptimizer,
							 private readonly icoImageOptimizer: IIcoImageOptimizer) {
	}

	/**
	 * Optimizes an image using any of the embedded optimizers.
	 * If the image format is unsupported, an un-manipulated Buffer will be returned.
	 * @param {IImageOptimizerOptions} options
	 * @returns {Promise<OptimizerResult>}
	 */
	public async optimize (options: IImageOptimizerOptions): Promise<OptimizerResult> {
		return await this.qualifyOptimization(options, [this.sharpImageOptimizer, this.svgoImageOptimizer, this.icoImageOptimizer]);
	}

	/**
	 * Qualifies optimizing the given input. Will pass it through the given optimizers until
	 * one of them successfully encodes it.
	 * @param {IImageOptimizerOptions} options
	 * @param {IImageOptimizer[]} optimizers
	 * @returns {Promise<OptimizerResult>}
	 */
	private async qualifyOptimization (options: IImageOptimizerOptions, optimizers: IImageOptimizer[]): Promise<OptimizerResult> {

		for (const optimizer of optimizers) {
			const result = await optimizer.optimize({...options, parent: this});
			if (result.optimized) return result;
		}
		this.buildLogger.debug(`No image optimizer could optimize file:`, options.path);
		return {optimized: false};
	}
}