import {FoveaHost, Json, INodeExtension} from "@fovea/common";
import {isICustomAttribute} from "../../../custom-attribute/is-i-custom-attribute";

// tslint:disable:no-any

/**
 * Gets the Shadow Root for a Node
 * @param {Node|FoveaHost} node
 * @returns {ShadowRoot}
 */
export function getRootForNode (node: Node & Partial<INodeExtension>|FoveaHost): Element|ShadowRoot {
	let root: Element|ShadowRoot|undefined = node.___root;
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