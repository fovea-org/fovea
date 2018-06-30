import {IRollupServiceGenerateBaseOptions} from "./i-rollup-service-generate-base-options";
import {IRollupPrePluginsOptions} from "./i-rollup-pre-plugins-options";
import {IRollupPostPluginsOptions} from "./i-rollup-post-plugins-options";

export interface IRollupServiceGenerateWithResultOptions extends IRollupServiceGenerateBaseOptions, IRollupPrePluginsOptions, IRollupPostPluginsOptions {
}