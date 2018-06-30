import {ExpressionChainObserverCallback} from "../expression-chain-observer-callback/expression-chain-observer-callback";
import {UpgradedExpressionChain} from "../upgraded-expression-chain/upgraded-expression-chain";
import {ITemplateVariables} from "../../../template/template-variables/i-template-variables";

export interface IObservedExpression<T> {
	expression: UpgradedExpressionChain;
	templateVariables?: ITemplateVariables;
	onChange: ExpressionChainObserverCallback<T>;
}