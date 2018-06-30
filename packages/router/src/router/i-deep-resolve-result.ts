import {IAliasRoute, IStandardRoute} from "../route/route";
import {IParams} from "../query/i-params";

export interface IDeepResolveResolveAliasValueMapper {
	true: {
		route: IStandardRoute;
		params: IParams;
	};
	false: {
		route: IStandardRoute|IAliasRoute;
		params: IParams;
	};
}
