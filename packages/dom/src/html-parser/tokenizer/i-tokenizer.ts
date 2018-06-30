import {ITokenizerConsumer} from "./i-tokenizer-consumer";

export interface ITokenizerOptions {
	xmlMode: boolean;
	decodeEntities?: boolean;
}

export interface ITokenizer {
	reset (): void;
	write (chunk: string): void;
	end (chunk: string): void;
	pause (): void;
	resume (): void;
	getAbsoluteIndex (): number;
}

export interface ITokenizerConstructor {
	new (options: ITokenizerOptions, parser: ITokenizerConsumer): ITokenizer;
}