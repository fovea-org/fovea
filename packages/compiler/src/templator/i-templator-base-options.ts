import {IPlacement} from "@wessberg/codeanalyzer";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

export interface ITemplatorBaseOptions {
	insertPlacement?: IPlacement;
	compilerOptions: IFoveaCompilerOptions;
	context: ICompilationContext;
	generateForStyles?: boolean;
	shouldExport?: boolean;
}