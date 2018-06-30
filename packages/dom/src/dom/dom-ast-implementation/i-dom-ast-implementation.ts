import {DOMAstRaw} from "./i-dom-ast-raw";
import {ITokenizerConstructor, ITokenizerOptions} from "../../html-parser/tokenizer/i-tokenizer";

export interface IDOMAstImplementationOptions extends ITokenizerOptions {
	Tokenizer?: ITokenizerConstructor;
}

export declare type IDOMASTImplementation = (html: string, options?: IDOMAstImplementationOptions) => DOMAstRaw;