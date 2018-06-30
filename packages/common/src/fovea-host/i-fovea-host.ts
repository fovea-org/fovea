import {ILifecycleHookable} from "../lifecycle/i-lifecycle-hookable";

export interface IFoveaHost extends HTMLElement, ILifecycleHookable {
}

export interface IFoveaHostConstructor {
	___compilerFlags: string;
	new (): IFoveaHost;
}