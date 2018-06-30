import {IPlacement} from "@wessberg/codeanalyzer";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

export interface IPropExtractorExtractOptions {
	mark: IFoveaHostMarkerMarkIncludeResult;
	insertPlacement: IPlacement;
	context: ICompilationContext;
	compilerOptions: IFoveaCompilerOptions;
}