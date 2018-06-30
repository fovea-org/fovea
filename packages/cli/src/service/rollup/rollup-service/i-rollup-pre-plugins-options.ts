import {PartialEnvironmentDefaults} from "../../../environment/i-environment-defaults";

export interface IRollupPrePluginsOptions {
	root: string;
	additionalEnvironmentVariables?: PartialEnvironmentDefaults;
}