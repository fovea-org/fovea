import {IState, IStateInput} from "../state/i-state";
import {RouterPushOptions} from "../router/router-push-options";

export declare type RouteGuard = (newState: IStateInput, currentState?: IState) => Promise<boolean|RouterPushOptions>;