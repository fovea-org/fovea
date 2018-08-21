import {TemplateMultiElement} from "../../../template/element/template-multi-element/template-multi-element";
import {ITemplateMultiElement} from "../../../template/element/template-multi-element/i-template-multi-element";
import {TemplateElement} from "../../../template/element/template-element/template-element";
import {ITemplateMultiElementOptions} from "../../../template/element/template-multi-element/i-template-multi-element-options";

/**
 * Creates a new (multi) element.
 * @param {string} selector
 * @param {ITemplateMultiElementOptions} options
 * @param {() => TemplateElement} templateElement
 * @returns {ITemplateMultiElement}
 */
export function ___createMultiElement (selector: string, options: ITemplateMultiElementOptions, templateElement: () => TemplateElement): ITemplateMultiElement {
	return new TemplateMultiElement(options, templateElement, selector, null);
}