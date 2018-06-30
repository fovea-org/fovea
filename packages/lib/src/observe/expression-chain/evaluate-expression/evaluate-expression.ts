import {Expression, isExpression, Json} from "@fovea/common";
import {AnyHost} from "../../../host/any-host/any-host";
import {ITemplateVariables} from "../../../template/template-variables/i-template-variables";

/**
 * Evaluates the provided expression in relation to the provided host
 * @param {AnyHost} host
 * @param {Expression|string} expression
 * @param {ITemplateVariables} [templateVariables]
 * @returns {Json}
 */
export function evaluateExpression (host: AnyHost, expression: string|Expression, templateVariables?: ITemplateVariables): Json {
	// If the expressions is merely a primitive value, return it
	if (!isExpression(expression)) return expression;

	// Otherwise, compute the expression
	const [compute] = expression;
	return compute(host, templateVariables);
}