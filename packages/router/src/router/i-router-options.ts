import {RouteInput} from "../route/route";
import {RouteGuard} from "../route/route-guard";

export interface IRouterOptions {
	root: HTMLElement;
	guards?: RouteGuard[];
	routes: RouteInput[];
}