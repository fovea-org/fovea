import {Path} from "path-parser";
import {IRouterTarget} from "./i-router-target";
import {IRouteMatch} from "./i-route-match";
import {RouteReferenceOptions} from "./route-reference";
import {RouteGuard} from "./route-guard";

// tslint:disable:no-any
export declare type RouteInstanceConstructor = new (...args: any[]) => IRouterTarget;
export declare type AsyncImportRoute = Promise<{ default: RouteInstanceConstructor }|RouteInstanceConstructor>;
export declare type RouteComponent = RouteInstanceConstructor|AsyncImportRoute|(() => AsyncImportRoute);

export interface IRouteBase {
	name?: string;
}

export interface IStandardRouteBase extends IRouteBase {
	component: RouteComponent;
	guards?: RouteGuard[];
}

export interface IRedirectRouteBase extends IRouteBase {
}

export interface IAliasRouteBase extends IRouteBase {
}

export interface IStandardRouteInput extends IStandardRouteBase {
	path: string;
}

export interface IStandardRouteWithChildrenInput extends IStandardRouteBase {
	path: string;
	defaultChild?: string;
	children: RouteInput[];
}

export interface IRedirectRouteInput extends IRedirectRouteBase {
	path: string;
	redirect: RouteReferenceOptions;
}

export interface IAliasRouteInput extends IAliasRouteBase {
	path: string;
	alias: RouteReferenceOptions;
}

export declare type RouteInput = IStandardRouteInput|IStandardRouteWithChildrenInput|IRedirectRouteInput|IAliasRouteInput;

export interface IStandardRoute extends IStandardRouteBase {
	parent?: IStandardRoute;
	path: Path;
}

export interface IStandardRouteWithChildren extends IStandardRouteBase {
	parent?: IStandardRoute;
	path: Path;
	defaultChild?: string;
	children: Route[];
}

export interface IRedirectRoute extends IRedirectRouteBase {
	parent?: IStandardRoute;
	path: Path;
	redirect: RouteReferenceOptions;
}

export interface IAliasRoute extends IAliasRouteBase {
	parent?: IStandardRoute;
	path: Path;
	alias: RouteReferenceOptions;
}

export interface IInstantiatedRoute extends IRouteMatch {
	instance: IRouterTarget;
}

export declare type Route = IStandardRoute|IStandardRouteWithChildren|IRedirectRoute|IAliasRoute;