import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {IPlacement} from "@wessberg/codeanalyzer";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

export interface IDependencyImporterImportOptions {
	mark: IFoveaHostMarkerMarkIncludeResult;
	context: ICompilationContext;
	insertPlacement: IPlacement;
	compilerOptions: IFoveaCompilerOptions;
}