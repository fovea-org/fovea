import {IPostCSSFoveaScssCleanupPluginOptions} from "./i-postcss-fovea-scss-cleanup-plugin-options";

export interface IPostCSSFoveaScssCleanupPluginContext extends IPostCSSFoveaScssCleanupPluginOptions {
	deferredWork: Set<Function>;
}