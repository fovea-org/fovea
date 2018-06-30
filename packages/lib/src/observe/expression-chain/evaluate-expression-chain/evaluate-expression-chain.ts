import {EvaluateExpressionChainResult} from "./i-evaluate-expression-chain-result";
import {evaluateExpression} from "../evaluate-expression/evaluate-expression";
import {evaluateExpressionChainCommon} from "./evaluate-expression-chain-common";
import {UpgradedExpressionChain} from "../upgraded-expression-chain/upgraded-expression-chain";
import {AnyHost} from "../../../host/any-host/any-host";
import {ITemplateVariables} from "../../../template/template-variables/i-template-variables";

/**
 * Evaluates all of the expressions provided in the given ExpressionChain and returns
 * an array of the results
 * @param {AnyHost} host
 * @param {UpgradedExpressionChain} expressions
 * @param {ITemplateVariables} [templateVariables]
 * @returns {EvaluateExpressionChainResult}
 */
export function evaluateExpressionChain (host: AnyHost, expressions: UpgradedExpressionChain, templateVariables?: ITemplateVariables): EvaluateExpressionChainResult {
	// Evaluate all of the expressions
	const results = expressions.map(expression => evaluateExpression(host, expression, templateVariables));

	// Delegate the rest of the work to the common logic
	return evaluateExpressionChainCommon(results, expressions.coerceTo);
}