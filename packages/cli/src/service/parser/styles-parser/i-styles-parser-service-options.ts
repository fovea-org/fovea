import {Plugin} from "postcss";
import {IFoveaCliConfig} from "../../../fovea-cli-config/i-fovea-cli-config";

export interface IStylesParserServiceOptions {
	postCSSPlugins?: Plugin<{}>[];
	watch: boolean;
	production: boolean;
	foveaCliConfig: IFoveaCliConfig;
	root: string;
}