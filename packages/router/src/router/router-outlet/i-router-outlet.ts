import {IInstantiatedRoute, Route} from "../../route/route";

export interface IRouterOutlet extends HTMLElement {
	readonly initial: IInstantiatedRoute|null;
	readonly previous: IInstantiatedRoute|null;
	readonly current: IInstantiatedRoute|null;
	readonly currentPath: string|null;
	replace (route: IInstantiatedRoute): Promise<boolean>;
	forward (route: IInstantiatedRoute): Promise<boolean>;
	back (route: IInstantiatedRoute): Promise<boolean>;
	clearRoute (route: Route): void;
}

export declare type RouterViewNavigationAction = "replace"|"forward"|"back";