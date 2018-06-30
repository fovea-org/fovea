import {NodeUuid} from "../node-uuid/node-uuid";
import {FoveaDOMAstNode} from "../fovea-dom-ast/i-fovea-dom-ast";

/**
 * Returns true if the given item is a FoveaDOMAstNode.
 * @param {null|NodeUuid|FoveaDOMAstNode} item
 * @returns {boolean}
 */
export function isFoveaDOMAstNode (item: null|NodeUuid|FoveaDOMAstNode): item is FoveaDOMAstNode {
	return item != null && typeof item !== "string" && (item.type === "text" || item.type === "custom" || item.type === "native" || item.type === "svg");
}