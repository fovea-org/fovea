import {CompressorServiceResult} from "./i-compressor-service-compress-result";
import {ICompressionAlgorithmOptions} from "./compression-algorithm-options";

export interface ICompressorService {
	compress (content: Buffer, options: ICompressionAlgorithmOptions): Promise<CompressorServiceResult<typeof options["brotli"], typeof options["gzip"]>>;
	compressAndWrite (content: Buffer, writePath: string, options: ICompressionAlgorithmOptions): Promise<void>;
}