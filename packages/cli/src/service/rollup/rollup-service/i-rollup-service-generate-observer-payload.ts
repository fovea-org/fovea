import {OutputBundle, RollupCache} from "rollup";

export interface IRollupServiceGenerateObserverPayload {
	outputBundle: OutputBundle;
	cache: RollupCache;
}