import {IImmutableFoveaStats} from "../stats/i-fovea-stats";
import {SourceMap} from "magic-string";
import {ICompilationContext} from "./i-compilation-context";
import {FoveaDiagnostic} from "../diagnostics/fovea-diagnostic";

export interface IFoveaCompilerCompileResult {
	readonly stats: IImmutableFoveaStats;
	readonly statsForFile: IImmutableFoveaStats;
	readonly diagnostics: FoveaDiagnostic[];
}

export interface ISourceCodeResult {
	code: string;
	map: SourceMap;
}

export interface IWatchedFile {
	file: string;
	recompileOnChange: Set<string>;
}

export interface IFoveaCompilerCompileChangeResult extends IFoveaCompilerCompileResult, ISourceCodeResult {
	hasChanged: true;
	context: ICompilationContext;
}

export interface IFoveaCompilerCompileNoChangeResult extends IFoveaCompilerCompileResult {
	hasChanged: false;
}

export declare type FoveaCompilerCompileResult = IFoveaCompilerCompileChangeResult|IFoveaCompilerCompileNoChangeResult;