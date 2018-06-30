import {AcceptedPlugin} from "postcss";
import {PluginConfigurationHook} from "../postcss/i-postcss-process-options";
import {IFoveaStylesBaseOptions} from "./i-fovea-styles-base-options";

export interface IFoveaStylesOptions extends IFoveaStylesBaseOptions {
	postCSSPlugins?: AcceptedPlugin[];
	production: boolean;
	pluginConfigurationHook?: PluginConfigurationHook;
}