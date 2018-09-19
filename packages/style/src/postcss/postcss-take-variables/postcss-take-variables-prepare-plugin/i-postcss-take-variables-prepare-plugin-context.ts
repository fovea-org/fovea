import {IPostcssTakeVariablesPreparePluginOptions} from "./i-postcss-take-variables-prepare-plugin-options";
import {Root} from "postcss";

export declare type LazyRootNodeWorker = (root: Root) => void;

export interface IPostcssTakeVariablesPreparePluginContext extends IPostcssTakeVariablesPreparePluginOptions {
	variables: { [key: string]: string };
	lazyWorkers: LazyRootNodeWorker[];
}