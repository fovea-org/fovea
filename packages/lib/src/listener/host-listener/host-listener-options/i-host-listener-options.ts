import {IHostListenerBaseOptions, IHostProp} from "@fovea/common";

export interface IHostListenerOptions extends IHostListenerBaseOptions {
	method: IHostProp;
	eventName: string;
}