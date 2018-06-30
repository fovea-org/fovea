import {SCSSToken} from "./scss-token";

export interface ISCSSTokenizerResult {
	back (token: SCSSToken): void;
	nextToken (): SCSSToken|undefined;
	endOfFile (): boolean;
}