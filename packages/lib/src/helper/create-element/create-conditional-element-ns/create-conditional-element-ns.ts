import {ExpressionChain, SVG_NAMESPACE_NAME} from "@fovea/common";
import {TemplateConditionalElement} from "../../../template/element/template-conditional-element/template-conditional-element";
import {ITemplateConditionalElement} from "../../../template/element/template-conditional-element/i-template-conditional-element";
import {TemplateElement} from "../../../template/element/template-element/template-element";

/**
 * Creates a new (conditional) SVGElement.
 * @param {string} qualifiedName
 * @param {ExpressionChain} condition
 * @param {() => TemplateElement} templateElement
 * @returns {ITemplateConditionalElement}
 */
export function __createConditionalElementNS (qualifiedName: string, condition: ExpressionChain, templateElement: () => TemplateElement): ITemplateConditionalElement {
	return new TemplateConditionalElement(condition, templateElement, qualifiedName, SVG_NAMESPACE_NAME);
}