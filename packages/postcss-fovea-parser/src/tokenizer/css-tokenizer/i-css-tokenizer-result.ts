import {CSSToken} from "./css-token";

export interface ICSSTokenizerResult {
	back (token: CSSToken): void;
	nextToken (): CSSToken|undefined;
	endOfFile (): boolean;
}