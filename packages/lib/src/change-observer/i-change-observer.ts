import {IHostProp} from "@fovea/common";

export interface IChangeObserver {
	method: IHostProp;
	props: string[];
	whenAllAreInitialized: boolean;
	whenConnected: boolean;
}