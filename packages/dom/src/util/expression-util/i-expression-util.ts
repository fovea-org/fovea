import {IMeta} from "../../meta/i-meta";
import {RawExpressionBindable} from "../../expression/raw-expression-bindable/raw-expression-bindable";
import {IContext} from "../context-util/i-context";
import {RawExpressionChainBindable} from "../../expression/raw-expression-chain-bindable/raw-expression-chain-bindable";

export interface IExpressionUtil {
	formatExpressionChain (content: string, context: IContext): RawExpressionChainBindable;
	formatExpression (content: string, meta: IMeta): RawExpressionBindable|string;
}