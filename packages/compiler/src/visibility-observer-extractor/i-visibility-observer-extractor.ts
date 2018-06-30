import {IVisibilityObserverExtractorExtractOptions} from "./i-visibility-observer-extractor-extract-options";

export interface IVisibilityObserverExtractor {
	extract (options: IVisibilityObserverExtractorExtractOptions): void;
}