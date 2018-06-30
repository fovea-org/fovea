import {RollupCache} from "rollup";

export interface IBundlerServiceBundlingEndedData {
	cache: RollupCache;
	generatedChunkNames: string[];
}