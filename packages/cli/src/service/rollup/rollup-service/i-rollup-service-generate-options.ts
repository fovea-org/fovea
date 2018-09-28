import {OutputOptions, InputOptions} from "rollup";
import {IRollupServiceGenerateBaseOptions} from "./i-rollup-service-generate-base-options";
import {IRollupPrePluginsOptions} from "./i-rollup-pre-plugins-options";
import {IRollupPostPluginsOptions} from "./i-rollup-post-plugins-options";
import {ISubscriber} from "../../../observable/i-subscriber";
import {IRollupServiceGenerateObserverPayload} from "./i-rollup-service-generate-observer-payload";

export interface IRollupServiceGenerateOptions extends IRollupServiceGenerateBaseOptions, IRollupPrePluginsOptions, IRollupPostPluginsOptions {
	output: OutputOptions;
	bundleExternals?: boolean;
	watch?: boolean;
	treeshake?: InputOptions["treeshake"];
	observer: ISubscriber<IRollupServiceGenerateObserverPayload>;
}