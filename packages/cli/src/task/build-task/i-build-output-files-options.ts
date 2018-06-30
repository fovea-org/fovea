import {ISharedRollupOptions} from "./i-shared-rollup-options";
import {IBuildOutputFromStylesOptions} from "./i-build-output-from-styles-options";

export interface IBuildOutputFilesOptions extends IBuildOutputFromStylesOptions {
	sharedRollupOptions: ISharedRollupOptions;
	globalStyles: string;
	polyfills: string[];
}