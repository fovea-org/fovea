import {AcceptedPlugin} from "postcss";

export interface IPostCSSConfiguration {
	defaultPlugins: AcceptedPlugin[];
	defaultProductionPlugins: AcceptedPlugin[];
	sassPlugins: AcceptedPlugin[];
}