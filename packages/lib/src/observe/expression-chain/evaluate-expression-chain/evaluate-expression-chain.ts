import {EvaluateExpressionChainResult} from "./i-evaluate-expression-chain-result";
import {IObservedExpression} from "../observe-expression-chain/i-observed-expression";
import {isStringOrSyncExpressionChain, SyncExpressionChain, AsyncExpressionChain} from "@fovea/common";
import {evaluateSyncExpressionChain} from "./evaluate-sync-expression-chain";
import {evaluateAsyncExpressionChain} from "./evaluate-async-expression-chain";

/**
 * Evaluates all of the expressions provided in the given ExpressionChain and returns
 * an array of the results
 * @param {IObservedExpression} options
 * @returns {EvaluateExpressionChainResult}
 */
export function evaluateExpressionChain<T> (options: Pick<IObservedExpression<T>, Exclude<keyof IObservedExpression<T>, "onChange">>): EvaluateExpressionChainResult {
	// If it isn't async, use the synchronous evaluator
	if (isStringOrSyncExpressionChain(options.expressions)) {
		return evaluateSyncExpressionChain(<IObservedExpression<T> & {expressions: string|SyncExpressionChain}> options);
	}

	else {
		return evaluateAsyncExpressionChain(<IObservedExpression<T> & {expressions: AsyncExpressionChain}> options);
	}
}