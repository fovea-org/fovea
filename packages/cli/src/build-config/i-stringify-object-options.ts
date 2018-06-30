export interface IStringifyObjectOptions {
	indent?: string;
	singleQuotes?: boolean;
	inlineCharacterLimit?: number;
	transform? (val: {}[]|object, i: number|string|symbol, value: string): string;
	filter? (o: {}, prop: string|symbol): boolean;
}