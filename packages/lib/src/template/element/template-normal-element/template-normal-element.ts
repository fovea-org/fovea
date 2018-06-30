import {TemplateElementBase} from "../template-element/template-element-base";
import {ITemplateNormalElement} from "./i-template-normal-element";
import {TemplateNormalElementResult} from "../../template-result/element/template-normal-element-result/template-normal-element-result";
import {ITemplateNormalElementResult} from "../../template-result/element/template-normal-element-result/i-template-normal-element-result";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";

/**
 * A factory for normal elements
 */
export class TemplateNormalElement extends TemplateElementBase implements ITemplateNormalElement {

	/**
	 * Constructs a new element
	 * @param {ITemplateConstructOptions} base
	 * @param {ITemplateVariables} templateVariables
	 * @param {IFoveaHost} host
	 * @param {Node} owner
	 * @param {ShadowRoot} root
	 * @param {ITemplateBase|null} previousSibling
	 * @returns {ITemplateNormalElementResult}
	 */
	public construct ({base, templateVariables, host, owner, root, previousSibling}: ITemplateConstructOptions): ITemplateNormalElementResult {
		const lastNode = this.namespace == null ? document.createElement(this.selector) : document.createElementNS(this.namespace, this.selector);

		// Merge with the base
		this.mergeBase(base);

		// Construct a new TemplateNormalElementResult
		return new TemplateNormalElementResult({lastNode, /*# IF hasTemplateCustomAttributes */ customAttributes: this.customAttributes, /*# END IF hasTemplateCustomAttributes */ /*# IF hasTemplateRefs */ ref: this.ref, /*# END IF hasTemplateRefs */ /*# IF hasTemplateAttributes */ attributes: this.attributes, properties: this.properties, /*# END IF hasTemplateAttributes */ children: this.children, /*# IF hasTemplateListeners */ listeners: this.listeners, /*# END IF hasTemplateListeners */ host, templateVariables, previousSibling, owner, root});
	}
}