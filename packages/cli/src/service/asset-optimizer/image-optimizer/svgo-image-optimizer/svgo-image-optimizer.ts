// @ts-ignore
import * as SVGO from "svgo";
import {Buffer} from "buffer";
import {IImageOptimizerOptions} from "../i-image-optimizer-options";
import {ImageFormatKind} from "../../../../format/image-format-kind";
import {ISvgoImageOptimizer} from "./i-svgo-image-optimizer";
import {OptimizerResult} from "../../i-optimizer-result";

/**
 * An ImageEncoder that uses SVGO as its' underlying implementation
 */
export class SvgoImageOptimizer implements ISvgoImageOptimizer {

	/**
	 * The SVGO instance to use
	 * @type {SVGO}
	 */
	private readonly svgo = new SVGO({
		plugins: this.plugins,
		floatPrecision: 2
	});

	/**
	 * Retrieves the default plugins to use with SVGO
	 * @returns {}
	 */
	private get plugins () {
		return [
			{
				cleanupAttrs: true
			},
			{
				removeDoctype: true
			},
			{
				removeXMLProcInst: true
			},
			{
				removeComments: true
			},
			{
				removeMetadata: true
			},
			{
				removeTitle: true
			},
			{
				removeDesc: true
			},
			{
				removeUselessDefs: true
			},
			{
				removeEditorsNSData: true
			},
			{
				removeEmptyAttrs: true
			},
			{
				removeHiddenElems: true
			},
			{
				removeEmptyText: true
			},
			{
				removeEmptyContainers: true
			},
			{
				removeEmptyContainers: true
			},
			{
				cleanupEnableBackground: true
			},
			{
				minifyStyles: true
			},
			{
				convertStyleToAttrs: true
			},
			{
				convertColors: true
			},
			{
				convertPathData: true
			},
			{
				convertTransform: true
			},
			{
				removeUnknownsAndDefaults: true
			},
			{
				removeNonInheritableGroupAttrs: true
			},
			{
				removeUselessStrokeAndFill: true
			},
			{
				removeUnusedNS: true
			},
			{
				cleanupIDs: true
			},
			{
				cleanupNumericValues: true
			},
			{
				cleanupListOfValues: true
			},
			{
				moveElemsAttrsToGroup: true
			},
			{
				moveGroupAttrsToElems: true
			},
			{
				collapseGroups: true
			},
			{
				mergePaths: true
			},
			{
				convertShapeToPath: true
			}
		];
	}

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
			case ImageFormatKind.SVG:
				// Only pass supported formats through the encoder
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

		const result = await this.svgo.optimize(options.buffer.toString(), {path: options.path});
		return Buffer.from(result.data);
	}
}