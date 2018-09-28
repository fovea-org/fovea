import {ICompressionAlgorithmOptions} from "../compression/compression-algorithm-options";

export interface IWriterServiceWriteOptions extends ICompressionAlgorithmOptions {
	compress: boolean;
}