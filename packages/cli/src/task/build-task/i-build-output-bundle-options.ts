import {ISharedRollupOptions} from "./i-shared-rollup-options";
import {ModuleFormat} from "rollup";
import {IResource} from "../../resource/i-resource";
import {IBuildOutputFromStylesOptions} from "./i-build-output-from-styles-options";

export interface IBuildOutputBundleOptions extends IBuildOutputFromStylesOptions {
	sharedRollupOptions: ISharedRollupOptions;
	moduleKind: ModuleFormat;
	resource: IResource;
	additionalEnvironmentVariables: { [key: string]: string };
	workerPolyfills: string[];
}