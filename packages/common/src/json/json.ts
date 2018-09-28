/*tslint:disable:no-any*/
export declare type Json = any;
/*tslint:enable:no-any*/

export type JSONValue = string|number|boolean|IJSONObject|IJSONArray;

export interface IJSONObject {
	[x: string]: JSONValue;
}

export interface IJSONArray extends Array<JSONValue> {
}