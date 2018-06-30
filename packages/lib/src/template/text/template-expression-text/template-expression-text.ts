import {ITemplateExpressionText} from "./i-template-expression-text";
import {Expression} from "@fovea/common";
import {ITemplateExpressionTextResult} from "../../template-result/text/template-expression-text-result/i-template-expression-text-result";
import {TemplateExpressionTextResult} from "../../template-result/text/template-expression-text-result/template-expression-text-result";
import {TemplateBase} from "../../template-base/template-base";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";

/**
 * A factory for expression text nodes
 */
export class TemplateExpressionText extends TemplateBase implements ITemplateExpressionText {

	constructor (public readonly expression: Expression) {
		super();
	}

	/**
	 * Constructs a new TemplateExpressionText
	 * @param {ShadowRoot} root
	 * @param {IFoveaHost} host
	 * @param {ITemplateVariables} templateVariables
	 * @param {Node} owner
	 * @param {ITemplateBase|null} previousSibling
	 * @returns {ITemplateExpressionTextResult}
	 */
	public construct ({root, host, templateVariables, owner, previousSibling}: ITemplateConstructOptions): ITemplateExpressionTextResult {

		// Construct a new TemplateExpressionTextResult
		return new TemplateExpressionTextResult({host, expression: this.expression, templateVariables, previousSibling, owner, root});
	}
}