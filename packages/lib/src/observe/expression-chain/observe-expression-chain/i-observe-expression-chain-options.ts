import {INullableObserveExpressionChainOptions} from "./i-nullable-observe-expression-chain-options";
import {UpgradedExpressionChain} from "../upgraded-expression-chain/upgraded-expression-chain";

export interface IObserveExpressionChainOptions<T> extends INullableObserveExpressionChainOptions<T> {
	expressions: UpgradedExpressionChain;
}