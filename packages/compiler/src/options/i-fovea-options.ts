import {IFoveaCompiler} from "../fovea-compiler/i-fovea-compiler";
import {IFoveaCompilerOptions} from "./i-fovea-compiler-options";

export interface IFoveaOptions extends IFoveaCompilerOptions {
	optimize: boolean;
	compiler: IFoveaCompiler;
}