import {SVG_NAMESPACE_NAME} from "@fovea/common";
import {TemplateMultiElement} from "../../../template/element/template-multi-element/template-multi-element";
import {ITemplateMultiElement} from "../../../template/element/template-multi-element/i-template-multi-element";
import {TemplateElement} from "../../../template/element/template-element/template-element";
import {ITemplateMultiElementOptions} from "../../../template/element/template-multi-element/i-template-multi-element-options";

/**
 * Creates a new (multi) SVGElement.
 * @param {string} qualifiedName
 * @param {ITemplateMultiElementOptions} options
 * @param {() => TemplateElement} templateElement
 * @returns {ITemplateMultiElement}
 */
export function __createMultiElementNS (qualifiedName: string, options: ITemplateMultiElementOptions, templateElement: () => TemplateElement): ITemplateMultiElement {
	return new TemplateMultiElement(options, templateElement, qualifiedName, SVG_NAMESPACE_NAME);
}