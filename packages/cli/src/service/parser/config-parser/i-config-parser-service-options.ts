import {IPackageJson} from "../../../package-json/i-package-json";
import {RollupCache} from "rollup";

export interface IConfigParserServiceOptions {
	root: string;
	path: string;
	packageJson: IPackageJson;
	cache?: RollupCache;
}