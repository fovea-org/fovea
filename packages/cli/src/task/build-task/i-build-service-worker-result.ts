import {IObserver} from "../../observable/i-observer";

export interface IBuildServiceWorkerResult extends IObserver {
	trigger (): void;
}