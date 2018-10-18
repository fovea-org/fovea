import {PartialEnvironmentDefaults} from "../../../environment/i-environment-defaults";
import {IProgressPluginOptions} from "../plugin/progress-plugin/i-progress-plugin-options";

export interface IRollupPrePluginsOptions {
	root: string;
	additionalEnvironmentVariables?: PartialEnvironmentDefaults;
	progress?: Pick<IProgressPluginOptions, Exclude<keyof IProgressPluginOptions, "root">>|false;
}