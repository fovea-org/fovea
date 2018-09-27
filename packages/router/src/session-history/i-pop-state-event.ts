import {StateUid} from "../state/i-state";

export interface IPopStateEvent extends PopStateEvent {
	state: StateUid;
}