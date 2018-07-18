import {IChildListObserverExtractorExtractOptions} from "./i-child-list-observer-extractor-extract-options";

export interface IChildListObserverExtractor {
	extract (options: IChildListObserverExtractorExtractOptions): void;
}