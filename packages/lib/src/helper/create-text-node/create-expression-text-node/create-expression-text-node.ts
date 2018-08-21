import {TemplateExpressionText} from "../../../template/text/template-expression-text/template-expression-text";
import {ITemplateExpressionText} from "../../../template/text/template-expression-text/i-template-expression-text";
import {Expression} from "@fovea/common";

/**
 * Creates an ITemplateExpressionText.
 * @param {Expression} expression
 * @returns {ITemplateExpressionText}
 */
export function ___createExpressionTextNode (expression: Expression): ITemplateExpressionText {
	return new TemplateExpressionText(expression);
}