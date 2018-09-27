import {TemplateExpressionText} from "../../../template/text/template-expression-text/template-expression-text";
import {ITemplateExpressionText} from "../../../template/text/template-expression-text/i-template-expression-text";
import {ExpressionChain} from "@fovea/common";

/**
 * Creates an ITemplateExpressionText.
 * @param {ExpressionChain} expressionChain
 * @returns {ITemplateExpressionText}
 */
export function ___createExpressionTextNode (expressionChain: ExpressionChain): ITemplateExpressionText {
	return new TemplateExpressionText(expressionChain);
}