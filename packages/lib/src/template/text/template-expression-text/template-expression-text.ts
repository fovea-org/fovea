import {ITemplateExpressionText} from "./i-template-expression-text";
import {ExpressionChain} from "@fovea/common";
import {ITemplateExpressionTextResult} from "../../template-result/text/template-expression-text-result/i-template-expression-text-result";
import {TemplateExpressionTextResult} from "../../template-result/text/template-expression-text-result/template-expression-text-result";
import {TemplateBase} from "../../template-base/template-base";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";

/**
 * A factory for expression text nodes
 */
export class TemplateExpressionText extends TemplateBase implements ITemplateExpressionText {

	constructor (public readonly expressionChain: ExpressionChain) {
		super();
	}

	/**
	 * Constructs a new TemplateExpressionText
	 * @param {ITemplateConstructOptions} options
	 * @returns {ITemplateExpressionTextResult}
	 */
	public construct ({root, host, templateVariables, owner, previousSibling}: ITemplateConstructOptions): ITemplateExpressionTextResult {

		// Construct a new TemplateExpressionTextResult
		return new TemplateExpressionTextResult({host, expressionChain: this.expressionChain, templateVariables, previousSibling, owner, root});
	}
}