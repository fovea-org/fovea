import {ExpressionChain, ExpressionChainDict} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds the provided attribute to the provided element.
 * @param {TemplateElement} element
 * @param {string} key
 * @param {ExpressionChain|ExpressionChainDict} [value]
 * @private
 */
export function ___addAttribute (element: TemplateElement, key: string, value?: ExpressionChain|ExpressionChainDict): void {
	element.addAttribute(key, value);
}