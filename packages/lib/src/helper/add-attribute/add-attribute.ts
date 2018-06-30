import {ExpressionChain} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds the provided attribute to the provided element.
 * @param {TemplateElement} element
 * @param {string} key
 * @param {ExpressionChain} [value]
 * @private
 */
export function __addAttribute (element: TemplateElement, key: string, value?: ExpressionChain): void {
	element.addAttribute(key, value);
}