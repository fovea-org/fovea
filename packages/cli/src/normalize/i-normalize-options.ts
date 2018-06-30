import {IBuildConfig} from "../build-config/i-build-config";

export interface INormalizeOptions<T, U = IBuildConfig> {
	config: U;
	options: T;
}