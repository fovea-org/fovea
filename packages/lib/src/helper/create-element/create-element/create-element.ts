import {ITemplateNormalElement} from "../../../template/element/template-normal-element/i-template-normal-element";
import {TemplateNormalElement} from "../../../template/element/template-normal-element/template-normal-element";

/**
 * Creates a new (normal) element.
 * @param {string} selector
 * @returns {ITemplateNormalElement}
 */
export function __createElement (selector: string): ITemplateNormalElement {
	return new TemplateNormalElement(selector, null);
}