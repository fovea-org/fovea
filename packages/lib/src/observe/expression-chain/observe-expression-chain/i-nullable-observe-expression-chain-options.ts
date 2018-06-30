import {ExpressionChain, ICustomAttribute, IFoveaHost, IType} from "@fovea/common";
import {ExpressionChainObserverCallback} from "../expression-chain-observer-callback/expression-chain-observer-callback";
import {ITemplateVariables} from "../../../template/template-variables/i-template-variables";

export interface INullableObserveExpressionChainOptions<T> {
	host: IFoveaHost|ICustomAttribute;
	expressions: ExpressionChain|undefined;
	templateVariables?: ITemplateVariables;
	onChange: ExpressionChainObserverCallback<T>;
	coerceTo: IType;
}