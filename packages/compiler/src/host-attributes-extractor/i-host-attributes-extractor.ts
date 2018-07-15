import {IHostAttributesExtractOptions} from "./i-host-attributes-extract-options";

export interface IHostAttributesExtractor {
	extract (options: IHostAttributesExtractOptions): void;
}