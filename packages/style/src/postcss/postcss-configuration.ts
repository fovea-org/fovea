import {IPostCSSConfiguration} from "./i-postcss-configuration";
// @ts-ignore
import postcssPresetEnv from "postcss-preset-env";
// @ts-ignore
import cssnano from "cssnano";
import {postCSSFoveaScssCleanupPlugin} from "./postcss-fovea-scss-cleanup-plugin/postcss-fovea-scss-cleanup-plugin";
import {postCSSFoveaScssPreparePlugin} from "./postcss-fovea-scss-prepare-plugin/postcss-fovea-scss-prepare-plugin";
import {postCSSDiscardDuplicatesPlugin} from "./postcss-discard-duplicates-plugin/post-css-discard-duplicates-plugin";
import {postCSSSassPlugin} from "./postcss-sass-plugin/postcss-sass-plugin";

export const postCSSConfiguration: IPostCSSConfiguration = {
	defaultPlugins: [postcssPresetEnv],
	defaultProductionPlugins: [cssnano, postCSSDiscardDuplicatesPlugin],
	sassPlugins: [postCSSFoveaScssPreparePlugin, postCSSSassPlugin, postCSSFoveaScssCleanupPlugin]
};