import {RollupCache} from "rollup";

export interface IRollupServiceGenerateWithResultResult<T> {
	cache: RollupCache;
	result: T;
}