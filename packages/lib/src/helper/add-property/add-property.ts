import {ExpressionChain} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds a property to the provided TemplateElement
 * @param {TemplateElement} element
 * @param {string} path
 * @param {ExpressionChain} value
 */
export function __addProperty (element: TemplateElement, path: string, value?: ExpressionChain): void {
	element.setProperty(path, value);
}