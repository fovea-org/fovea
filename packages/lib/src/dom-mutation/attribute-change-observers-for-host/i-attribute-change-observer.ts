import {IHostProp, IMutationObserverBaseOptions} from "@fovea/common";

export interface IAttributeChangeObserver extends IMutationObserverBaseOptions {
	method: IHostProp;
	attributes: string[];
}