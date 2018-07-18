import {IOnAttributeChangeExtractorExtractOptions} from "./i-on-attribute-change-extractor-extract-options";

export interface IOnAttributeChangeExtractor {
	extract (options: IOnAttributeChangeExtractorExtractOptions): void;
}