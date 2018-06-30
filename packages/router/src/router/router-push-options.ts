import {IParams} from "../query/i-params";

export interface IRouterPushOptions {
	title?: string;
	query?: IParams|string;
}

export interface IRouterPushPathOptions extends IRouterPushOptions {
	path: string;
}

export interface IRouterPushNameOptions extends IRouterPushOptions {
	name: string;
	params?: IParams;
}

export declare type RouterPushOptions = IRouterPushNameOptions|IRouterPushPathOptions;