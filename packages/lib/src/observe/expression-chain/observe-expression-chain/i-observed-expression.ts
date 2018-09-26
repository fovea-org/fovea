import {ExpressionChain, FoveaHost, IType} from "@fovea/common";
import {ExpressionChainObserverCallback} from "../expression-chain-observer-callback/expression-chain-observer-callback";
import {ITemplateVariables} from "../../../template/template-variables/i-template-variables";

export interface IObservedExpression<T> {
	host: FoveaHost;
	expressions: ExpressionChain;
	templateVariables?: ITemplateVariables;
	onChange: ExpressionChainObserverCallback<T>;
	coerceTo: IType;
}