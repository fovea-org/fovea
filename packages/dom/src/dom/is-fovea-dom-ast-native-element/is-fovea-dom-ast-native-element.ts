import {NodeUuid} from "../node-uuid/node-uuid";
import {FoveaDOMAstNode, IFoveaDOMAstNativeElement} from "../fovea-dom-ast/i-fovea-dom-ast";
import {isFoveaDOMAstNode} from "../is-fovea-dom-ast-node/is-fovea-dom-ast-node";

/**
 * Returns true if the given item is a IFoveaDOMAstNativeElement.
 * @param {null|NodeUuid|FoveaDOMAstNode} item
 * @returns {boolean}
 */
export function isFoveaDOMAstNativeElement (item: null|NodeUuid|FoveaDOMAstNode): item is IFoveaDOMAstNativeElement {
	return isFoveaDOMAstNode(item) && item.type === "native";
}