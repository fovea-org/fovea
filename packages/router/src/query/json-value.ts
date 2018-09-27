export type JSONValue = string|number|boolean|IJSONObject|IJSONArray;

export interface IJSONObject {
	[x: string]: JSONValue;
}

export interface IJSONArray extends Array<JSONValue> {
}