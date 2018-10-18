import {Plugin} from "postcss";
import {IFoveaCliConfig} from "../../../fovea-cli-config/i-fovea-cli-config";

export interface IStylesParserServiceOptions {
	postCSSPlugins?: Plugin<{}>[];
	production: boolean;
	foveaCliConfig: IFoveaCliConfig;
	root: string;
	tag: string;
}