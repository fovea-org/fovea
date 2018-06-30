import {IEmitExtractorExtractOptions} from "./i-emit-extractor-extract-options";

export interface IEmitExtractor {
	extract (options: IEmitExtractorExtractOptions): void;
}