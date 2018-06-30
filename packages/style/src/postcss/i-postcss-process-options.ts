import {AcceptedPlugin, Syntax} from "postcss";

export declare type PluginConfigurationHook = (pluginName: string) => {}|null|undefined;

export interface IPostCSSProcessOptions {
	template: string;
	file: string;
	isScss: boolean;
	plugins?: AcceptedPlugin[];
	prePlugins?: AcceptedPlugin[];
	production: boolean;
	syntax: Syntax;
	pluginConfigurationHook?: PluginConfigurationHook;
}