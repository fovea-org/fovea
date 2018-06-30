import {IState} from "../state/i-state";

export declare type StateSubscriber = (state: IState) => void|Promise<void>;