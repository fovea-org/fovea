import {ILifecycleHookable, IStaticLifecycleHookable} from "../lifecycle/i-lifecycle-hookable";
import {Uuid} from "../uuid/uuid";
import {INodeExtension} from "../node-extension/i-node-extension";

export interface IFoveaHost extends ILifecycleHookable, INodeExtension {
	___hostElement: Element;
}

export interface IFoveaHostConstructor extends IStaticLifecycleHookable {
	___uuid: Uuid;
	___compilerFlags: string;
}