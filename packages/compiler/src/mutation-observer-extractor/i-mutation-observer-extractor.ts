import {IMutationObserverExtractorExtractOptions} from "./i-mutation-observer-extractor-extract-options";

export interface IMutationObserverExtractor {
	extract (options: IMutationObserverExtractorExtractOptions): void;
}