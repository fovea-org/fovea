import {NODE_TO_ROOT_MAP} from "../node-to-root-map/node-to-root-map";
import {ICustomAttribute, Json} from "@fovea/common";
import {isICustomAttribute} from "../../../custom-attribute/is-i-custom-attribute";

/**
 * Gets the Shadow Root for a Node
 * @param {Node|ICustomAttribute} node
 * @returns {ShadowRoot}
 */
export function getRootForNode (node: Node|ICustomAttribute): Element|ShadowRoot {
	let root: Element|ShadowRoot|undefined = NODE_TO_ROOT_MAP.get(node);
	if (root == null) {
		root = /*# IF hasICustomAttributes */ isICustomAttribute(node) ? getRootForNode(node.___hostElement) : /*# END IF hasICustomAttributes */ (<Json>node).getRootNode();
	}

	// If the root is still undefined, throw an exception
	if (root == null) {
		throw new ReferenceError(`Internal Error: A ShadowRoot could not be retrieved for a ${/*# IF hasICustomAttributes */ isICustomAttribute(node) ? `Custom Attribute` : /*# END IF hasICustomAttributes */ `node with tagName: ${node.nodeName}`}`);
	}

	return root;
}