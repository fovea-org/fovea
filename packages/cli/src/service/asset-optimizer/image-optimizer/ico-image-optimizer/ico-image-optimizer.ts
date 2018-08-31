// @ts-ignore
import toIco from "to-ico";
import {IImageOptimizerOptions} from "../i-image-optimizer-options";
import {ImageFormatKind} from "../../../../format/image-format-kind";
import {IIcoImageOptimizer} from "./i-ico-image-optimizer";
import {OptimizerResult} from "../../i-optimizer-result";

/**
 * An Image Optimizer that uses "to-ico" as its underlying implementation
 */
export class IcoImageOptimizer implements IIcoImageOptimizer {

	/**
	 * Encodes an image using "to-ico".
	 * If the image format is unsupported, an un-manipulated Buffer will be returned.
	 * @param {IImageOptimizerOptions} options
	 * @returns {Promise<OptimizerResult>}
	 */
	public async optimize (options: IImageOptimizerOptions): Promise<OptimizerResult> {
		return await this.qualifyOptimization(options);
	}

	/**
	 * Qualifies encoding the given input paths depending on its' kind
	 * @param {IImageOptimizerOptions} options
	 * @returns {Promise<OptimizerResult>}
	 */
	private async qualifyOptimization (options: IImageOptimizerOptions): Promise<OptimizerResult> {
		if (options.outputFormat === ImageFormatKind.ICO) {
			return {optimized: true, buffer: await this.runOptimizer(options)};
		}

		return {optimized: false};
	}

	/**
	 * Encodes an image using "to-ico"
	 * @param {IImageOptimizerOptions} options
	 * @returns {Promise<Buffer>}
	 */
	private async runOptimizer (options: IImageOptimizerOptions): Promise<Buffer> {
		// If it is already an ico file, there's nothing we can do about it
		if (options.path.endsWith(".ico")) return options.buffer;
		return await toIco(await this.getNormalizedPngBuffer(options));
	}

	/**
	 * Normalizes the input buffer to a 64x64, 8-bit per sample bit-depth PNG image
	 * @param {IImageOptimizerOptions} options
	 * @returns {Promise<Buffer>}
	 */
	private async getNormalizedPngBuffer (options: IImageOptimizerOptions): Promise<Buffer> {
		if (options.parent == null) return options.buffer;
		const result = await options.parent.optimize({
			...options,
			outputFormat: ImageFormatKind.PNG,
			media: {
				...options.media,
				progressive: false
			}
		});
		return result.optimized ? result.buffer : options.buffer;
	}
}