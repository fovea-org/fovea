import {IHostProp, IMutationObserverBaseOptions} from "@fovea/common";

export interface IChildListObserver extends IMutationObserverBaseOptions {
	method: IHostProp;
	added: boolean;
}