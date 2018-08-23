import {ILifecycleHookable, IStaticLifecycleHookable} from "../lifecycle/i-lifecycle-hookable";

/*tslint:disable:no-any*/
export interface ICustomAttribute extends ILifecycleHookable {
	___hostElement: Element;
}

export interface ICustomAttributeConstructor extends IStaticLifecycleHookable {
	___compilerFlags: string;
	new (hostElement: Element): ICustomAttribute;
}