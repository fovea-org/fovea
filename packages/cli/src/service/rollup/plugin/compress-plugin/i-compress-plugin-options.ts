import {ICompressorService} from "../../../compression/i-compressor-service";
import {ICompressionAlgorithmOptions} from "../../../compression/compression-algorithm-options";

export interface ICompressPluginOptions extends ICompressionAlgorithmOptions {
	compressor: ICompressorService;
}