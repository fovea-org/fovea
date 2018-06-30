import {IPostCSSFoveaScssPreparePluginOptions} from "./i-postcss-fovea-scss-prepare-plugin-options";

export interface IPostCSSFoveaScssPreparePluginContext extends IPostCSSFoveaScssPreparePluginOptions {
	deferredWork: Set<Function>;
}