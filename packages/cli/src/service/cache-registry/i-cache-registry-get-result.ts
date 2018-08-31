import {CacheEntryKind} from "./cache-entry-kind";
import {IAssetOptimizerService} from "../asset-optimizer/i-asset-optimizer-service";

// tslint:disable:no-any

// tslint:disable:array-type

export declare type FirstArgumentType<T extends (...args: any[]) => any> = T extends (arg: infer R) => any ? R : any;
export declare type StripPromise<T> = T extends Promise<infer U> ? U : Promise<T>;

export interface ICacheRegistryGetResult {
	[CacheEntryKind.OPTIMIZED_ASSET_BUFFERS]: StripPromise<ReturnType<IAssetOptimizerService["optimizeDirectory"]>>;
}