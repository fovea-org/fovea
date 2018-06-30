import {AcceptedPlugin} from "postcss";
import {PostCSSFoveaParserFunction} from "@fovea/postcss-fovea-parser";

export declare type PluginConfigurationHook = (pluginName: string) => {}|null|undefined;

export interface IPostCSSProcessOptions {
	template: string;
	file: string;
	isScss: boolean;
	plugins?: AcceptedPlugin[];
	prePlugins?: AcceptedPlugin[];
	production: boolean;
	parser: PostCSSFoveaParserFunction;
	pluginConfigurationHook?: PluginConfigurationHook;
}