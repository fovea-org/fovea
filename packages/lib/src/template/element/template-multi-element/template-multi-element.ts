import {TemplateElementBase} from "../template-element/template-element-base";
import {ExpressionChain, FOREACH_CUSTOM_ATTRIBUTE_AS_DEFAULT_VALUE, FOREACH_CUSTOM_ATTRIBUTE_INDEX_AS_DEFAULT_VALUE} from "@fovea/common";
import {ITemplateMultiElement} from "./i-template-multi-element";
import {TemplateElement} from "../template-element/template-element";
import {ITemplateMultiElementConstructOptions} from "./i-template-multi-element-construct-options";
import {TemplateMultiElementResult} from "../../template-result/element/template-multi-element-result/template-multi-element-result";
import {ITemplateMultiElementOptions} from "./i-template-multi-element-options";
import {ITemplateMultiElementResult} from "../../template-result/element/template-multi-element-result/i-template-multi-element-result";

/**
 * A factory for multi elements
 */
export class TemplateMultiElement extends TemplateElementBase implements ITemplateMultiElement {

	/**
	 * The model to stamp templates for
	 * @type {ExpressionChain}
	 */
	private readonly model: ExpressionChain;

	/**
	 * The 'as' property value
	 * @type {ExpressionChain}
	 */
	private readonly as: ExpressionChain;

	/**
	 * The 'indexAs' property value
	 * @type {ExpressionChain}
	 */
	private readonly indexAs: ExpressionChain;

	constructor ({model, as = [FOREACH_CUSTOM_ATTRIBUTE_AS_DEFAULT_VALUE], indexAs = [FOREACH_CUSTOM_ATTRIBUTE_INDEX_AS_DEFAULT_VALUE]}: ITemplateMultiElementOptions,
							 private readonly templateElementCtor: () => TemplateElement,
							 selector: string,
							 namespace: string|null) {
		super(selector, namespace);
		this.model = model;
		this.as = as;
		this.indexAs = indexAs;
	}

	/**
	 * Constructs a new multi element
	 * @param {ITemplateConstructOptions} base
	 * @param {ShadowRoot} root
	 * @param {Node} owner
	 * @param {ITemplateVariables} templateVariables
	 * @param {IFoveaHost} host
	 * @param {ITemplateBase|null} previousSibling
	 * @returns {ITemplateMultiElementResult}
	 */
	public construct ({base, root, owner, templateVariables, host, previousSibling}: ITemplateMultiElementConstructOptions): ITemplateMultiElementResult {
		// Merge with the base
		this.mergeBase(base);

		return new TemplateMultiElementResult({host, templateVariables, model: this.model, as: this.as, base: this, owner, root, templateElementCtor: this.templateElementCtor, indexAs: this.indexAs, previousSibling});
	}
}