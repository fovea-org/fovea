import {IPostcssTakeVariablesPluginOptions} from "./i-postcss-take-variables-plugin-options";

export interface IPostcssTakeVariablesPluginContext extends IPostcssTakeVariablesPluginOptions {
	variables: {[key: string]: string};
}