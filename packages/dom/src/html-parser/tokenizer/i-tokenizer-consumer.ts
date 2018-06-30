export interface ITokenizerConsumer {
	ontext (text: string): void;
	oncomment (comment: string): void;
	oncdata (cdata: string): void;
	onopentagend (): void;
	onselfclosingtag (): void;
	onattribdata (data: string): void;
	onattribname (attribName: string): void;
	onattribend (): void;
	ondeclaration (declaration: string): void;
	onprocessinginstruction (instruction: string): void;
	onerror (error: Error, state?: number): void;
	onend (): void;
}