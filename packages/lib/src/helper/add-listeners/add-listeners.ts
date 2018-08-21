import {___addListener} from "../add-listener/add-listener";
import {ExpressionChain} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";

/**
 * Adds all the provided listeners provided as arguments of tuples.
 * @param {TemplateElement} element
 * @param {[string, ExpressionChain]} listeners
 */
export function ___addListeners (element: TemplateElement, ...listeners: [string, ExpressionChain][]): void {
	listeners.forEach(([name, handler]) => ___addListener(element, name, handler));
}