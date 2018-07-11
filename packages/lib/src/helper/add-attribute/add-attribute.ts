import {ExpressionChain} from "@fovea/common";
import {TemplateElement} from "../../template/element/template-element/template-element";
import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";

/**
 * Adds the provided attribute to the provided element.
 * @param {TemplateElement} element
 * @param {string} key
 * @param {ExpressionChain|IExpressionChainDict} [value]
 * @private
 */
export function __addAttribute (element: TemplateElement, key: string, value?: ExpressionChain|IExpressionChainDict): void {
	element.addAttribute(key, value);
}