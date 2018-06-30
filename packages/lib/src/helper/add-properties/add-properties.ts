import {__addProperty} from "../add-property/add-property";
import {ExpressionChain} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds all the provided properties to the TemplateElement.
 * Properties are given as a rest argument of tuples of key-value pairs
 * @param {TemplateElement} element
 * @param {...[string, ExpressionChain]} properties
 */
export function __addProperties (element: TemplateElement, ...properties: [string, ExpressionChain][]): void {
	properties.forEach(([path, value]) => __addProperty(element, path, value));
}