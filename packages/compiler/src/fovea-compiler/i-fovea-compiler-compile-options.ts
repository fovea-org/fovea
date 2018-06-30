import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {IFoveaCompileOptions} from "./i-fovea-compile-options";

export interface IFoveaCompilerCompileOptions extends IFoveaCompileOptions {
	options?: Partial<IFoveaCompilerOptions>;
}