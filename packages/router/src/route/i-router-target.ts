import {IRouteInstanceNavigateToOptions} from "./i-route-instance-navigate-to-options";
import {IRouteInstanceNavigateOptions} from "./i-route-instance-navigate-options";

export interface IRouterTarget extends HTMLElement {
	onNavigateTo? (options: IRouteInstanceNavigateToOptions): Promise<void>;
	onNavigateFrom? (options: IRouteInstanceNavigateOptions): Promise<void>;
}