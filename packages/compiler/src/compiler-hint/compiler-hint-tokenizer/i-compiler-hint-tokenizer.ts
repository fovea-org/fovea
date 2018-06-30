import {CompilerHintSplitted, IEndHint, IIfHint} from "../compiler-hint/compiler-hint";
import {CompilerHintToken} from "../compiler-hint-token/compiler-hint-token";

export interface ICompilerHintTokenizer {
	createIfHint (pos: number, end: number, expression: CompilerHintSplitted, endHint: IEndHint, code: string): IIfHint;
	createEndHint (pos: number, end: number, hint: CompilerHintToken, code: string): IEndHint;
	nextIfStatement (str: string, from: number): [number, string];
	nextEndStatement (str: string, from: number): [number, string];
	isIfStatement (str: string): boolean;
	isEndStatement (str: string): boolean;
	takeIfExpression (str: string): string;
	takeEndHint (str: string): [string, string];
	splitByOperators (str: string): CompilerHintSplitted;
}