import {TemplateNormalElement} from "../../../template/element/template-normal-element/template-normal-element";
import {ITemplateNormalElement} from "../../../template/element/template-normal-element/i-template-normal-element";
import {SVG_NAMESPACE_NAME} from "@fovea/common";

/**
 * Creates a new (normal) SVGElement.
 * @param {string} qualifiedName
 * @returns {ITemplateNormalElement}
 */
export function __createElementNS (qualifiedName: string): ITemplateNormalElement {
	return new TemplateNormalElement(qualifiedName, SVG_NAMESPACE_NAME);
}