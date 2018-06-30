import {AcceptedPlugin} from "postcss";
import {PluginConfigurationHook} from "@fovea/style";

export interface IFoveaCompilerPostCSSOptions {
	plugins: AcceptedPlugin[];
	hook: PluginConfigurationHook;
}

export interface IFoveaCompilerOptions {
	exclude: Iterable<RegExp>|RegExp;
	dryRun: boolean;
	production: boolean;
	postcss?: Partial<IFoveaCompilerPostCSSOptions>;
}