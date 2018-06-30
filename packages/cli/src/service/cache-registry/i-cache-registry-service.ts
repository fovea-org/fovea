import {ICacheRegistryGetOptionsMap} from "./i-cache-registry-get-options";
import {ICacheRegistryGetResult} from "./i-cache-registry-get-result";
import {CacheEntryKind} from "./cache-entry-kind";

export interface ICacheRegistryService {
	get<T extends CacheEntryKind> (kind: T, options: ICacheRegistryGetOptionsMap[T]): Promise<ICacheRegistryGetResult[T]|undefined>;
	set<T extends CacheEntryKind> (kind: T, options: ICacheRegistryGetOptionsMap[T], payload: ICacheRegistryGetResult[T]): Promise<void>;
	cacheNeedsUpdate<T extends CacheEntryKind> (kind: T, {entryKindOptions, cacheOptions}: ICacheRegistryGetOptionsMap[T]): Promise<boolean>;
}