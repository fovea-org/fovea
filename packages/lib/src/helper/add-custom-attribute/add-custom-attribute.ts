import {ExpressionChain, ExpressionChainDict} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds a Custom Attribute to the provided TemplateElement
 * @param {TemplateElement} element
 * @param {string} name
 * @param {ExpressionChain|ExpressionChainDict} value
 */
export function ___addCustomAttribute (element: TemplateElement, name: string, value?: ExpressionChain|ExpressionChainDict): void {
	element.addCustomAttribute(name, value);
}