import {ILifecycleHookable, IStaticLifecycleHookable} from "../lifecycle/i-lifecycle-hookable";

export interface IFoveaHost extends HTMLElement, ILifecycleHookable {
}

export interface IFoveaHostConstructor extends IStaticLifecycleHookable {
	___compilerFlags: string;
	new (): IFoveaHost;
}