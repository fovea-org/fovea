import {IRollupPrePluginsOptions} from "./i-rollup-pre-plugins-options";
import {IRollupPostPluginsOptions} from "./i-rollup-post-plugins-options";
import {IPackageJson} from "../../../package-json/i-package-json";
import {IFoveaCliConfig} from "../../../fovea-cli-config/i-fovea-cli-config";
import {IResource} from "../../../resource/i-resource";
import {RollupCache, InputOptions} from "rollup";

export interface IRollupServiceConsumer extends IRollupPrePluginsOptions, IRollupPostPluginsOptions {
	paths: {[key: string]: string};
	resource: IResource;
	config: IFoveaCliConfig;
	packageJson: IPackageJson;
	cache?: RollupCache;
	treeshake?: InputOptions["treeshake"];
	globals?: {[key: string]: string};
}