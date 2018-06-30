import {NodeUuid} from "../node-uuid/node-uuid";
import {FoveaDOMAstNode, IFoveaDOMAstCustomElement} from "../fovea-dom-ast/i-fovea-dom-ast";
import {isFoveaDOMAstNode} from "../is-fovea-dom-ast-node/is-fovea-dom-ast-node";

/**
 * Returns true if the given item is an IFoveaDOMAstCustomElement.
 * @param {null|NodeUuid|FoveaDOMAstNode} item
 * @returns {boolean}
 */
export function isFoveaDOMAstCustomElement (item: null|NodeUuid|FoveaDOMAstNode): item is IFoveaDOMAstCustomElement {
	return isFoveaDOMAstNode(item) && item.type === "custom";
}