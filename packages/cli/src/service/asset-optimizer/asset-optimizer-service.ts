import {IAssetOptimizerService} from "./i-asset-optimizer-service";
import {IFileTypeDetectorService} from "../file-type-detector/i-file-type-detector-service";
import {FileFormatKind} from "../../format/file-format-kind";
import {ImageFormatKind} from "../../format/image-format-kind";
import deepExtend from "deep-extend";
import {IImageOptimizer} from "./image-optimizer/i-image-optimizer";
import {IAssetOptimizerServiceOptimizeOptions} from "./i-asset-optimizer-service-optimize-options";
import {ILoggerService} from "../logger/i-logger-service";
import {IAssetOptimizerServiceOptimizeDirectoryOptions} from "./i-asset-optimizer-service-optimize-directory-options";
import {ScriptFormatKind} from "../../format/script-format-kind";
import {IScriptOptimizer} from "./script-optimizer/i-script-optimizer";
import {IAssetOptimizerServiceOptimizeDirectoryResult} from "./i-asset-optimizer-service-optimize-directory-result";

// tslint:disable:no-magic-numbers

/**
 * A service that helps with optimizing assets
 */
export class AssetOptimizerService implements IAssetOptimizerService {

	constructor (private readonly imageOptimizer: IImageOptimizer,
							 private readonly scriptOptimizer: IScriptOptimizer,
							 private readonly fileTypeDetector: IFileTypeDetectorService,
							 private readonly buildLogger: ILoggerService) {
	}

	/**
	 * Optimizes the asset with the given paths
	 * @param {IAssetOptimizerServiceOptimizeOptions} options
	 * @returns {Promise<Buffer>}
	 */
	public async optimize (options: IAssetOptimizerServiceOptimizeOptions): Promise<Buffer> {
		const outputFormat = this.detectFileFormatKind(options);

		// If the file is an Image file, pass it through the Image optimizer
		if (this.isImageFormatKind(outputFormat)) {
			return await this.runImageOptimizer(options, outputFormat);
		}

		// If the file is a script file, pass it through the Script optimizer
		else if (this.isScriptFormatKind(outputFormat)) {
			return await this.runScriptOptimizer(options, outputFormat);
		}

		else {
			// Return the original buffer
			this.buildLogger.debug(`No optimizer could optimize file:`, options.path);
			return options.buffer;
		}
	}

	/**
	 * Optimizes all assets within the provided map
	 * @param {IAssetOptimizerServiceOptimizeDirectoryOptions} opts
	 * @returns {Promise<IAssetOptimizerServiceOptimizeDirectoryResult>}
	 */
	public async optimizeDirectory ({assetMap, appIcon, options}: IAssetOptimizerServiceOptimizeDirectoryOptions): Promise<IAssetOptimizerServiceOptimizeDirectoryResult> {
		const optimizedAssetMap: { [key: string]: Buffer } = {};
		const appIconMap: { [key: string]: Buffer } = {};

		// For each of them in parallel, pass them through the 'optimize' function and map their Buffers to their paths
		await Promise.all(Object.entries(assetMap).map(async ([path, buffer]) => {
			optimizedAssetMap[path] = await this.optimize({...options, path, buffer});
		}));

		// Update all nested refs so that nothing will be mutated when deepExtended later on
		const baseOptions: IAssetOptimizerServiceOptimizeOptions = {
			...options,
			path: appIcon.path,
			buffer: appIcon.buffer,
			media: {
				...options.media,
				maxSize: {...options.media.maxSize}
			}
		};

		// Prepare all app icons by generating ordinary icons for each of the sizes
		await Promise.all(appIcon.sizes.map(async size => {
			appIconMap[String(size)] = await this.optimize(deepExtend(baseOptions, {media: {maxSize: {width: size, height: size}}}));
		}));

		// Return the resulting dictionary object
		return {
			appIconMap,
			assetMap: optimizedAssetMap
		};
	}

	/**
	 * Detects the FileFormatKind from the given Buffer and options
	 * @param {IAssetOptimizerServiceOptimizeOptions} options
	 * @returns {FileFormatKind}
	 */
	private detectFileFormatKind (options: IAssetOptimizerServiceOptimizeOptions): FileFormatKind {
		// If the format is given from the options, return that one
		if (options.outputFormat != null) return options.outputFormat;
		return this.fileTypeDetector.detect(options.buffer, options.path);
	}

	/**
	 * Runs the given buffer with the given options through all image optimizers until one of them can handle it
	 * @param {IAssetOptimizerServiceOptimizeOptions} options
	 * @param {ImageFormatKind} outputFormat
	 * @returns {Promise<Buffer>}
	 */
	private async runImageOptimizer ({buffer, path, assetDir, ...rest}: IAssetOptimizerServiceOptimizeOptions, outputFormat: ImageFormatKind): Promise<Buffer> {
		// Simply return the original buffer if optimization should be skipped
		if (rest.skipOptimization) {
			this.buildLogger.debug("Skipping optimization of asset:", path);
			return buffer;
		}
		const result = await this.imageOptimizer.optimize({...rest, path, buffer, outputFormat});
		return result.optimized ? result.buffer : buffer;
	}

	/**
	 * Runs the given buffer with the given options through all script optimizers until one of them can handle it
	 * @param {IAssetOptimizerServiceOptimizeOptions} options
	 * @param {ScriptFormatKind} outputFormat
	 * @returns {Promise<Buffer>}
	 */
	private async runScriptOptimizer ({path, buffer, assetDir, ...rest}: IAssetOptimizerServiceOptimizeOptions, outputFormat: ScriptFormatKind): Promise<Buffer> {
		// Simply return the original buffer if optimization should be skipped
		if (rest.skipOptimization) {
			this.buildLogger.debug("Skipping optimization of asset:", path);
			return buffer;
		}
		const result = await this.scriptOptimizer.optimize({...rest, outputFormat, buffer, path});
		return result.optimized ? result.buffer : buffer;
	}

	/**
	 * Returns true if the given kind is an ImageFormatKind
	 * @param {FileFormatKind} kind
	 * @returns {boolean}
	 */
	private isImageFormatKind (kind: FileFormatKind): kind is ImageFormatKind {
		return Object.values(ImageFormatKind).includes(kind);
	}

	/**
	 * Returns true if the given kind is a ScriptFormatKind
	 * @param {FileFormatKind} kind
	 * @returns {boolean}
	 */
	private isScriptFormatKind (kind: FileFormatKind): kind is ScriptFormatKind {
		return Object.values(ScriptFormatKind).includes(kind);
	}

}