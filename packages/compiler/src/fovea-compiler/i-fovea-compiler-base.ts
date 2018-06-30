import {IFoveaCompilerCompileOptions} from "./i-fovea-compiler-compile-options";
import {FoveaCompilerCompileResult, ISourceCodeResult} from "./i-fovea-compiler-compile-result";
import {IImmutableFoveaStats} from "../stats/i-fovea-stats";
import {FoveaDiagnostic} from "../diagnostics/fovea-diagnostic";

export interface IFoveaCompilerBase {
	readonly stats: IImmutableFoveaStats;
	readonly diagnostics: FoveaDiagnostic[];
	compile (options: IFoveaCompilerCompileOptions): Promise<FoveaCompilerCompileResult>;
	transformCompilerHints (libCode: string, file: string): ISourceCodeResult;
}
