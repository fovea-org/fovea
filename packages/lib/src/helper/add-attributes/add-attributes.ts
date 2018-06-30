import {__addAttribute} from "../add-attribute/add-attribute";
import {ExpressionChain} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds all the provided attributes to the element.
 * Attributes are given as a rest argument of tuples of key-value pairs
 * @param {TemplateElement} element
 * @param {...[string, ExpressionChain|undefined]} attributes
 */
export function __addAttributes (element: TemplateElement, ...attributes: [string, ExpressionChain|undefined][]): void {
	attributes.forEach(([key, value]) => __addAttribute(element, key, value));
}