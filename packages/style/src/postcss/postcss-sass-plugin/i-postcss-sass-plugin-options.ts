import {TransformHook} from "../../fovea-style/transform-hook";

export interface IPostCSSSassPluginOptions {
	includePaths: string[];
	from: string;
	to: string;
	transform: TransformHook;
}