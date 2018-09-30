import {RouterViewNavigationAction} from "../router/router-outlet/i-router-outlet";
import {IRouteInstance} from "./route";

export interface IRouteInstanceNavigateOptions extends IRouteInstance {
	action: RouterViewNavigationAction;
}