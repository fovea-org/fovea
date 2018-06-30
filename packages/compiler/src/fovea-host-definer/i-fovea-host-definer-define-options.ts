import {IPlacement} from "@wessberg/codeanalyzer";
import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

export interface IFoveaHostDefinerDefineOptions {
	mark: IFoveaHostMarkerMarkIncludeResult;
	compilerOptions: IFoveaCompilerOptions;
	insertPlacement: IPlacement;
	context: ICompilationContext;
}