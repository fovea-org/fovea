import {CompilerHintToken} from "../compiler-hint-token/compiler-hint-token";
import {IFoveaStats, IImmutableFoveaStats} from "../../stats/i-fovea-stats";

export interface IHint {
	pos: number;
	end: number;
	text: string;
}

export declare type CompilerHintOperatorToken = "||"|"&&"|"!";

export declare interface ICompilerHintOperator {
	operator: CompilerHintOperatorToken;
}

export declare type CompilerHintSplitted = [keyof IFoveaStats|ICompilerHintOperator];

export interface IIfHint extends IHint {
	kind: CompilerHintToken.IF;
	expression: CompilerHintSplitted;
	endHint: IEndHint;
	evaluate (stats: IImmutableFoveaStats): boolean;
}

export interface IEndHint extends IHint {
	kind: CompilerHintToken.END;
	hint: CompilerHintToken;
}

export declare type CompilerHint = IIfHint|IEndHint;