import {IFoveaCompileOptions} from "./i-fovea-compile-options";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {ICompilationContext} from "./i-compilation-context";

export interface IFoveaCompileFileOptions extends IFoveaCompileOptions {
	compilerOptions: IFoveaCompilerOptions;
	context: ICompilationContext;
}