import {FoveaHost} from "@fovea/common";
import {IObserver} from "../observe/i-observer";

export interface IListenResult extends IObserver {
	name: string;
	host: FoveaHost;
}