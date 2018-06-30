import {IHostProp, IMutationObserverBaseOptions} from "@fovea/common";

export interface IMutationObserver extends IMutationObserverBaseOptions {
	method: IHostProp;
	added: boolean;
}