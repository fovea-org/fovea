import {IRouteInstanceNavigateOptions} from "./i-route-instance-navigate-options";
import {IParams} from "../query/i-params";

export interface IRouteInstanceNavigateToOptions extends IRouteInstanceNavigateOptions {
	params: IParams;
	query: IParams;
}