import {IPlacement} from "@wessberg/codeanalyzer";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

export interface IParentMergerMergeOptions {
	mark: IFoveaHostMarkerMarkIncludeResult;
	compilerOptions: IFoveaCompilerOptions;
	insertPlacement: IPlacement;
	context: ICompilationContext;
}