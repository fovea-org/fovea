import {EvaluateExpressionChainResult} from "./i-evaluate-expression-chain-result";
import {evaluateAsyncExpression} from "../evaluate-expression/evaluate-async-expression";
import {evaluateExpressionChainCommon} from "./evaluate-expression-chain-common";
import {UpgradedExpressionChain} from "../upgraded-expression-chain/upgraded-expression-chain";
import {AnyHost} from "../../../host/any-host/any-host";
import {ITemplateVariables} from "../../../template/template-variables/i-template-variables";

/*# IF hasAsyncEvaluations */

/**
 * Evaluates all of the expressions provided in the given ExpressionChain and returns
 * an array of the results
 * @param {AnyHost} host
 * @param {UpgradedExpressionChain} expressions
 * @param {ITemplateVariables} [templateVariables]
 * @returns {EvaluateExpressionChainResult}
 */
export async function evaluateAsyncExpressionChain (host: AnyHost, expressions: UpgradedExpressionChain, templateVariables?: ITemplateVariables): Promise<EvaluateExpressionChainResult> {
	// Evaluate all of the expressions
	const results = await Promise.all(expressions.map(async expression => await evaluateAsyncExpression(host, expression, templateVariables)));

	// Delegate the rest of the work to the common logic
	return evaluateExpressionChainCommon(results, expressions.coerceTo);
} /*# END IF hasAsyncEvaluations */