import {TemplateElementBase} from "../template-element/template-element-base";
import {ITemplateConditionalElement} from "./i-template-conditional-element";
import {TemplateElement} from "../template-element/template-element";
import {TemplateConditionalElementResult} from "../../template-result/element/template-conditional-element-result/template-conditional-element-result";
import {ITemplateConditionalElementConstructOptions} from "./i-template-conditional-element-construct-options";
import {ExpressionChain} from "@fovea/common";
import {ITemplateConditionalElementResult} from "../../template-result/element/template-conditional-element-result/i-template-conditional-element-result";

/**
 * A factory for conditional elements
 */
export class TemplateConditionalElement extends TemplateElementBase implements ITemplateConditionalElement {

	constructor (private readonly condition: ExpressionChain,
							 private readonly templateElementCtor: () => TemplateElement,
							 selector: string,
							 namespace: string|null) {
		super(selector, namespace);
	}

	/**
	 * Constructs a new conditional element
	 * @param {ITemplateConditionalElementConstructOptions} options
	 * @returns {ITemplateConditionalElementResult}
	 */
	public construct ({base, host, templateVariables, owner, root, previousSibling}: ITemplateConditionalElementConstructOptions): ITemplateConditionalElementResult {
		// Merge with the base
		this.mergeBase(base);

		return new TemplateConditionalElementResult({base: this, condition: this.condition, templateElementCtor: this.templateElementCtor, host, templateVariables, owner, root, previousSibling});
	}
}