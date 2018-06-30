import {IPlacement} from "@wessberg/codeanalyzer";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";
import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";

export interface IEmitExtractorExtractOptions {
	mark: IFoveaHostMarkerMarkIncludeResult;
	context: ICompilationContext;
	insertPlacement: IPlacement;
	compilerOptions: IFoveaCompilerOptions;
}