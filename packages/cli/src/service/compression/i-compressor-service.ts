import {ICompressorServiceCompressResult} from "./i-compressor-service-compress-result";

export interface ICompressorService {
	compress (content: Buffer): Promise<ICompressorServiceCompressResult>;
	compressAndWrite (content: Buffer, writePath: string): Promise<void>;
}