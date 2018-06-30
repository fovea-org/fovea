import {IStateCloneable} from "../state/i-state";

export interface IPopStateEvent extends PopStateEvent {
	state: IStateCloneable|null;
}