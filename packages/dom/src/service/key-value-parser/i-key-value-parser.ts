export interface IKeyValueParser {
	parse<T> (value: string): string|T;
}