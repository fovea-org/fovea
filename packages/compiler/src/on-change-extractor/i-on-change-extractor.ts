import {IOnChangeExtractorExtractOptions} from "./i-on-change-extractor-extract-options";

export interface IOnChangeExtractor {
	extract (options: IOnChangeExtractorExtractOptions): void;
}