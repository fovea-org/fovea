import {ISetOnHostExtractorExtractOptions} from "./i-set-on-host-extractor-extract-options";

export interface ISetOnHostExtractor {
	extract (options: ISetOnHostExtractorExtractOptions): void;
}