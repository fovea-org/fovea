import {CacheEntryKind} from "./cache-entry-kind";
import {IAssetOptimizerService} from "../asset-optimizer/i-asset-optimizer-service";
import {FirstArgumentType} from "./i-cache-registry-get-result";

// tslint:disable:no-any

// tslint:disable:array-type

export interface ICacheRegistryCacheOptions {
	root: string;
	skip: boolean;
}

export interface ICacheRegistryGetOptions<T> {
	cacheOptions: ICacheRegistryCacheOptions;
	entryKindOptions: T;
}

export interface ICacheRegistryGetOptionsMap {
	[CacheEntryKind.OPTIMIZED_ASSET_BUFFERS]: ICacheRegistryGetOptions<FirstArgumentType<IAssetOptimizerService["optimizeDirectory"]>>;
}