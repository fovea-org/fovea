import {ExpressionChain} from "@fovea/common";
import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";

export interface ITemplateProperty {
	key: string;
	value?: ExpressionChain|IExpressionChainDict;
}