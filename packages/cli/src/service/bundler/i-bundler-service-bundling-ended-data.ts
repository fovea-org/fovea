import {RollupCache} from "rollup";

export interface IBundlerServiceBundlingEndedResult {
	cache: RollupCache;
	generatedChunkNames: string[];
}