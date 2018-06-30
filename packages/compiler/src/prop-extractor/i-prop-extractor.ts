import {IPropExtractorExtractOptions} from "./i-prop-extractor-extract-options";

export interface IPropExtractor {
	extract (options: IPropExtractorExtractOptions): void;
}