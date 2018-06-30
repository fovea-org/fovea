import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";
import {IImmutableFoveaStats} from "../stats/i-fovea-stats";

export interface IRegisterTemplateOptions {
	content: string;
	resolvedPath: string;
	compilerOptions: IFoveaCompilerOptions;
	context: ICompilationContext;
	generateForStyles?: boolean;
	otherTemplateStats?: IImmutableFoveaStats;
}