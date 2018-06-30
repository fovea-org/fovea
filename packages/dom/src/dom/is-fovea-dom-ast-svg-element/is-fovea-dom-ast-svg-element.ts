import {NodeUuid} from "../node-uuid/node-uuid";
import {FoveaDOMAstNode, IFoveaDOMAstSvgElement} from "../fovea-dom-ast/i-fovea-dom-ast";
import {isFoveaDOMAstNode} from "../is-fovea-dom-ast-node/is-fovea-dom-ast-node";

/**
 * Returns true if the given item is a IFoveaDOMAstSvgElement.
 * @param {null|NodeUuid|FoveaDOMAstNode} item
 * @returns {boolean}
 */
export function isFoveaDOMAstSvgElement (item: null|NodeUuid|FoveaDOMAstNode): item is IFoveaDOMAstSvgElement {
	return isFoveaDOMAstNode(item) && item.type === "svg";
}