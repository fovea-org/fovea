import {IPlacement} from "@wessberg/codeanalyzer";
import {IFoveaCompilerOptions} from "../options/i-fovea-compiler-options";
import {IImmutableFoveaStats} from "../stats/i-fovea-stats";
import {ICompilationContext} from "../fovea-compiler/i-compilation-context";

export interface ITemplatorBaseOptions {
	insertPlacement?: IPlacement;
	compilerOptions: IFoveaCompilerOptions;
	context: ICompilationContext;
	generateForStyles?: boolean;
	shouldExport?: boolean;
	otherTemplateStats?: IImmutableFoveaStats;
}