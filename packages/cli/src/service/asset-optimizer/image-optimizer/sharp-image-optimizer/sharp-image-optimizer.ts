import sharp, {SharpInstance} from "sharp";
import {IImageOptimizerOptions} from "../i-image-optimizer-options";
import {ImageFormatKind} from "../../../../format/image-format-kind";
import {ISharpImageOptimizer} from "./i-sharp-image-optimizer";
import {OptimizerResult} from "../../i-optimizer-result";

/**
 * An ImageEncoder that uses Sharp as its' underlying implementation
 */
export class SharpImageOptimizer implements ISharpImageOptimizer {
	/**
	 * The minimum supported compression level for zlib
	 * @type {number}
	 */
	private static readonly ZLIB_MIN_COMPRESSION_LEVEL: number = 0;
	/**
	 * The maximum supported compression level for zlib
	 * @type {number}
	 */
	private static readonly ZLIB_MAX_COMPRESSION_LEVEL: number = 9;

	/**
	 * The minimum supported quality level for JPEG
	 * @type {number}
	 */
	private static readonly JPEG_MIN_QUALITY: number = 0;

	/**
	 * The maximum supported quality level for JPEG
	 * @type {number}
	 */
	private static readonly JPEG_MAX_QUALITY: number = 100;

	/**
	 * The minimum supported quality level for WEBP
	 * @type {number}
	 */
	private static readonly WEBP_MIN_QUALITY: number = 0;

	/**
	 * The maximum supported quality level for WEBP
	 * @type {number}
	 */
	private static readonly WEBP_MAX_QUALITY: number = 100;

	/**
	 * The minimum supported quality level for TIFF
	 * @type {number}
	 */
	private static readonly TIFF_MIN_QUALITY: number = 0;

	/**
	 * The maximum supported quality level for TIFF
	 * @type {number}
	 */
	private static readonly TIFF_MAX_QUALITY: number = 100;

	/**
	 * Encodes an image using Sharp.
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
		switch (options.outputFormat) {
			case ImageFormatKind.JPEG:
			case ImageFormatKind.PNG:
			case ImageFormatKind.WEBP:
			case ImageFormatKind.RAW:
			case ImageFormatKind.TIFF:
				return {optimized: true, buffer: await this.runOptimizer(options)};

			default:
				return {optimized: false};

		}
	}

	/**
	 * Encodes an image using Sharp
	 * @param {IImageOptimizerOptions} options
	 * @returns {Promise<Buffer>}
	 */
	private async runOptimizer (options: IImageOptimizerOptions): Promise<Buffer> {
		const sharpInstance =
			this.setFormat(
				options,
				sharp(options.buffer)
					.withoutEnlargement()
					.rotate()
			);

		// Apply resize options to the SharpInstance
		if (options.media.maxSize != null) {
			sharpInstance.resize(options.media.maxSize.width, options.media.maxSize.height);
		}

		// Await sharp doing its' thing
		return await sharpInstance.toBuffer();
	}

	/**
	 * Normalizes the quality level to use depending on the input format
	 * @param {ImageFormatKind} outputFormat
	 * @param {number} quality
	 * @returns {number}
	 */
	private normalizeQualityLevel ({outputFormat, media: {quality}}: IImageOptimizerOptions): number {
		const absQuality = Math.abs(quality);
		const normalizedQuality = Math.max(0, Math.min(1, absQuality));
		const inPercent = normalizedQuality * 100;

		switch (outputFormat) {

			case ImageFormatKind.JPEG:
				// The quality will be a number between 0 and 100
				return Math.max(
					SharpImageOptimizer.JPEG_MIN_QUALITY,
					Math.min(
						SharpImageOptimizer.JPEG_MAX_QUALITY,
						Math.round((inPercent * SharpImageOptimizer.JPEG_MAX_QUALITY) / 100)
					)
				);

			case ImageFormatKind.PNG:
				// The quality will be a compression level for zlib between 0 and 9
				return SharpImageOptimizer.ZLIB_MAX_COMPRESSION_LEVEL - Math.max(
					SharpImageOptimizer.ZLIB_MIN_COMPRESSION_LEVEL,
					Math.min(
						SharpImageOptimizer.ZLIB_MAX_COMPRESSION_LEVEL,
						Math.round((inPercent * SharpImageOptimizer.ZLIB_MAX_COMPRESSION_LEVEL) / 100)
					)
				);

			case ImageFormatKind.WEBP:
				// The quality will be a num between 0 and 100
				return Math.max(
					SharpImageOptimizer.WEBP_MIN_QUALITY,
					Math.min(
						SharpImageOptimizer.WEBP_MAX_QUALITY,
						Math.round((inPercent * SharpImageOptimizer.WEBP_MAX_QUALITY) / 100)
					)
				);

			case ImageFormatKind.TIFF:
				// The quality will be a num between 0 and 100
				return Math.max(
					SharpImageOptimizer.TIFF_MIN_QUALITY,
					Math.min(
						SharpImageOptimizer.TIFF_MAX_QUALITY,
						Math.round((inPercent * SharpImageOptimizer.TIFF_MAX_QUALITY) / 100)
					)
				);
			default:
				throw new TypeError(`${this.normalizeQualityLevel.name} could not compute the quality to use for an image of kind: ${ImageFormatKind[outputFormat]}`);
		}
	}

	/**
	 * Sets a Sharp-compatible format from the given options
	 * @param {IImageOptimizerOptions} options
	 * @param {SharpInstance} sharpInstance
	 * @returns {SharpInstance}
	 */
	private setFormat (options: IImageOptimizerOptions, sharpInstance: SharpInstance): SharpInstance {
		switch (options.outputFormat) {

			case ImageFormatKind.JPEG:
				return sharpInstance.jpeg({
					progressive: options.media.progressive,
					optimizeScans: true,
					quality: this.normalizeQualityLevel(options)
				});

			case ImageFormatKind.PNG:
				return sharpInstance.png({
					progressive: options.media.progressive,
					compressionLevel: this.normalizeQualityLevel(options)
				});

			case ImageFormatKind.RAW:
				return sharpInstance.raw();

			case ImageFormatKind.TIFF:
				return sharpInstance.tiff({
					quality: this.normalizeQualityLevel(options)
				});

			case ImageFormatKind.WEBP:
				return sharpInstance.webp({
					quality: this.normalizeQualityLevel(options),
					alphaQuality: this.normalizeQualityLevel(options)
				});

			default:
				// Fall back to returning the SharpInstance
				return sharpInstance;

		}
	}

}