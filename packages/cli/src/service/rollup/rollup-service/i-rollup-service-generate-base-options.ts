import {Plugin, RollupCache} from "rollup";
import {IPackageJson} from "../../../package-json/i-package-json";

export interface IRollupServiceGenerateBaseOptions {
	input: {[key: string]: string};
	plugins?: Plugin[];
	cache?: RollupCache;
	packageJson: IPackageJson;
	context?: string;
}