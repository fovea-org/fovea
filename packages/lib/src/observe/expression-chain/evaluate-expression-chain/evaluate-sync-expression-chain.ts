import {EvaluateExpressionChainResult} from "./i-evaluate-expression-chain-result";
import {evaluateExpression} from "../evaluate-expression/evaluate-expression";
import {evaluateExpressionChainCommon} from "./evaluate-expression-chain-common";
import {IObservedExpression} from "../observe-expression-chain/i-observed-expression";
import {SyncExpressionChain, isPureStringExpressionChain} from "@fovea/common";

/**
 * Evaluates all of the expressions provided in the given ExpressionChain and returns
 * an array of the results
 * @param {IObservedExpression} options
 * @returns {EvaluateExpressionChainResult}
 */
export function evaluateSyncExpressionChain<T> ({expressions, host, templateVariables, coerceTo}: {expressions: string|SyncExpressionChain} & Pick<IObservedExpression<T>, Exclude<keyof IObservedExpression<T>, "onChange"|"expressions">>): EvaluateExpressionChainResult {
	// Evaluate all of the expressions
	const results = isPureStringExpressionChain(expressions)
		? evaluateExpression(host, expressions, templateVariables)
		: expressions.map(expression => evaluateExpression(host, expression, templateVariables));

	// Delegate the rest of the work to the common logic
	return evaluateExpressionChainCommon(results, coerceTo);
}