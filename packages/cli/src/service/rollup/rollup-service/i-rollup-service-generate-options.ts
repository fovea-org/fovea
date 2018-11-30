import {InputOptions, OutputOptions} from "rollup";
import {IRollupServiceGenerateBaseOptions} from "./i-rollup-service-generate-base-options";
import {IRollupPrePluginsOptions} from "./i-rollup-pre-plugins-options";
import {IRollupPostPluginsOptions} from "./i-rollup-post-plugins-options";
import {BuildError} from "../../../error/build-error/build-error";

export interface IRollupErrorObserver {
	error (error: BuildError<{}>): void;
}

export type IRollupServiceGenerateOptions = IRollupServiceGenerateBaseOptions & IRollupPrePluginsOptions & IRollupPostPluginsOptions & {
	output: OutputOptions;
	bundleExternals?: boolean;
	watch?: boolean;
	treeshake?: InputOptions["treeshake"];
	errorObserver: IRollupErrorObserver;
};