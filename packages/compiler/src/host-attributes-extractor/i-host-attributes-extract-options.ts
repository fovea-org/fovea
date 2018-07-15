import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";
import {IPlacement} from "@wessberg/codeanalyzer";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";

export interface IHostAttributesExtractOptions {
	mark: IFoveaHostMarkerMarkIncludeResult;
	context: ICompilationContext;
	insertPlacement: IPlacement;
	compilerOptions: IFoveaCompilerOptions;
}