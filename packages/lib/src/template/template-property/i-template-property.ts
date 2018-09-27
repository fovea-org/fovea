import {ExpressionChain, ExpressionChainDict} from "@fovea/common";

export interface ITemplateProperty {
	key: string;
	value?: ExpressionChain|ExpressionChainDict;
}