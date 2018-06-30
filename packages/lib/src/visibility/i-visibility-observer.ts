import {IHostProp, IVisibilityObserverBaseOptions} from "@fovea/common";

export interface IVisibilityObserver extends IVisibilityObserverBaseOptions {
	method: IHostProp;
	visible: boolean;
}