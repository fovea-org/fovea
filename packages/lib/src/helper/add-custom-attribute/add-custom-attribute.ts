import {ExpressionChain} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";
import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";

/**
 * Adds a Custom Attribute to the provided TemplateElement
 * @param {TemplateElement} element
 * @param {string} name
 * @param {ExpressionChain|IExpressionChainDict} value
 */
export function __addCustomAttribute (element: TemplateElement, name: string, value?: ExpressionChain|IExpressionChainDict): void {
	element.addCustomAttribute(name, value);
}