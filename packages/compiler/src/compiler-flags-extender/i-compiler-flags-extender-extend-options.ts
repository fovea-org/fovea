import {IFoveaHostMarkerMarkIncludeResult} from "../fovea-marker/fovea-host-marker-mark-result";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

export interface ICompilerFlagsExtenderExtendOptions {
	mark: IFoveaHostMarkerMarkIncludeResult;
	compilerOptions: IFoveaCompilerOptions;
	context: ICompilationContext;
}