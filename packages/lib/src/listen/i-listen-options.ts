import {FoveaHost} from "@fovea/common";

export interface IListenOptions {
	passive?: boolean;
	name: string;
	handler: Function;
	on: EventTarget;
	rawOn?: string|EventTarget;
	host: FoveaHost;
	once?: boolean;
}