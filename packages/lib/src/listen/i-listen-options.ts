import {ICustomAttribute, IFoveaHost} from "@fovea/common";

export interface IListenOptions {
	passive?: boolean;
	name: string;
	handler: Function;
	on: EventTarget;
	rawOn: string|EventTarget|undefined;
	host: IFoveaHost|ICustomAttribute;
	once?: boolean;
}