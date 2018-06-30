import {ExpressionChain} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds the provided listener to the provided element
 * @param {TemplateElement} element
 * @param {string} name
 * @param {ExpressionChain} handler
 * @private
 */
export function __addListener (element: TemplateElement, name: string, handler: ExpressionChain): void {
	element.addListener(name, handler);
}