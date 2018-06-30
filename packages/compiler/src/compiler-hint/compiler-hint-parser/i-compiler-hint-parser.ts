import {CompilerHintAst} from "../compiler-hint-ast/compiler-hint-ast";

export interface ICompilerHintParser {
	parse (code: string): CompilerHintAst;
}