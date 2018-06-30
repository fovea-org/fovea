import {RawExpressionChainBindable} from "../../../expression/raw-expression-chain-bindable/raw-expression-chain-bindable";

export interface ITemplateMultiElementOptions {
	model: RawExpressionChainBindable;
	indexAs?: RawExpressionChainBindable;
	as?: RawExpressionChainBindable;
}