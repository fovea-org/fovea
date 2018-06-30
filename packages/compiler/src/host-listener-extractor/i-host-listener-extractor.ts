import {IHostListenerExtractorExtractOptions} from "./i-host-listener-extractor-extract-options";

export interface IHostListenerExtractor {
	extract (options: IHostListenerExtractorExtractOptions): void;
}