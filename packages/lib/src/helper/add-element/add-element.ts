import {TemplateNode} from "../../template/node/template-node";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds the given TemplateNode to the other one.
 * @param {TemplateNode} element
 * @param {TemplateElement} addTo
 */
export function __addElement (element: TemplateNode, addTo: TemplateElement): void {
	addTo.appendChild(element);
}