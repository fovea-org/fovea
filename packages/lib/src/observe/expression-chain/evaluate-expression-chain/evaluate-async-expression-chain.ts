import {EvaluateExpressionChainResult} from "./i-evaluate-expression-chain-result";
import {evaluateAsyncExpression} from "../evaluate-expression/evaluate-async-expression";
import {evaluateExpressionChainCommon} from "./evaluate-expression-chain-common";
import {IObservedExpression} from "../observe-expression-chain/i-observed-expression";

/**
 * Evaluates all of the expressions provided in the given ExpressionChain and returns
 * an array of the results
 * @param {IObservedExpression} options
 * @returns {EvaluateExpressionChainResult}
 */
export async function evaluateAsyncExpressionChain<T> ({expressions, host, templateVariables, coerceTo}: Pick<IObservedExpression<T>, Exclude<keyof IObservedExpression<T>, "onChange">>): Promise<EvaluateExpressionChainResult> {
	// Evaluate all of the expressions
	const results = await Promise.all(expressions.map(async expression => await evaluateAsyncExpression(host, expression, templateVariables)));

	// Delegate the rest of the work to the common logic
	return evaluateExpressionChainCommon(results, coerceTo);
}