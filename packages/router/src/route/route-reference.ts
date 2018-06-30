import {IParams} from "../query/i-params";

export interface IRouteReferenceOptions {
}

export interface IRouteReferenceNameOptions extends IRouteReferenceOptions {
	params?: IParams;
	name: string;
}

export interface IRouteReferencePathOptions extends IRouteReferenceOptions {
	path: string;
}

export declare type RouteReferenceOptions = IRouteReferenceNameOptions|IRouteReferencePathOptions;