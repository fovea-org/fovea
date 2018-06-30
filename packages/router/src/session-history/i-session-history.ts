import {IState, IStateInput} from "../state/i-state";
import {StateSubscriber} from "./state-subscriber";
import {IStateObserver} from "./i-state-observer";

export interface ISessionHistory {
	readonly length: number;
	readonly stateHistory: IState[];
	readonly current: IState|undefined;
	dispose (): void;
	push (state: IStateInput): void;
	replace (state: IStateInput): void;
	pop (): void;
	go (n: number): void;
	onInitialState (callback: StateSubscriber): IStateObserver;
	onPastState (callback: StateSubscriber): IStateObserver;
	onFutureState (callback: StateSubscriber): IStateObserver;
}