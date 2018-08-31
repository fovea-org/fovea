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
		root = isICustomAttribute(node) ? getRootForNode(node.___hostElement) : (<Json>node).getRootNode();
	}

	// If the root is still undefined, throw an exception
	if (root == null) {
		const nodeDescription = isICustomAttribute(node) ? `Custom Attribute` : `node with tagName: ${node.nodeName}`;
		throw new ReferenceError(`Internal Error: A ShadowRoot could not be retrieved for a ${nodeDescription}`);
	}

	return root;
}