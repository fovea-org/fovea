import {ExpressionChain} from "@fovea/common";
import {TemplateConditionalElement} from "../../../template/element/template-conditional-element/template-conditional-element";
import {ITemplateConditionalElement} from "../../../template/element/template-conditional-element/i-template-conditional-element";
import {TemplateElement} from "../../../template/element/template-element/template-element";

/**
 * Creates a new (conditional) element.
 * @param {string} selector
 * @param {ExpressionChain} condition
 * @param {() => TemplateElement} templateElement
 * @returns {ITemplateConditionalElement}
 */
export function __createConditionalElement (selector: string, condition: ExpressionChain, templateElement: () => TemplateElement): ITemplateConditionalElement {
	return new TemplateConditionalElement(condition, templateElement, selector, null);
}