export interface IPostCSSProcessResultMessage {
	type: string;
	text?: string;
	plugin?: string;
	browsers?: string[];
}

export interface IPostCSSProcessResult {
	css: string;
	messages: IPostCSSProcessResultMessage[];
}