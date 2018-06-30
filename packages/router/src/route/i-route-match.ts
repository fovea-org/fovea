import {IStandardRoute} from "./route";
import {IState} from "../state/i-state";

export interface IRouteMatch {
	state: IState;
	route: IStandardRoute;
}