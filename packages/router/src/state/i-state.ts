import {IParams} from "../query/i-params";

export declare type StateUid = number;

export interface IStateBase {
	title: string;
	path: string;
}

export interface IStateInput extends IStateBase {
	query: IParams;
	params: IParams;
}

export interface IStateCloneable extends IStateBase {
	id: StateUid;
	query: string;
	params: string;
	queryUrlFriendly: string;
	paramsUrlFriendly: string;
}

export interface IState extends IStateInput {
	id: StateUid;
}