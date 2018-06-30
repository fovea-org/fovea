import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {NODE_TO_HOST_MAP} from "../node-to-host-map/node-to-host-map";

/**
 * Gets the IFoveaHost for a Node
 * @param {Node} node
 * @returns {IFoveaHost|ICustomAttribute}
 */
export function getHostForNode (node: Node): IFoveaHost|ICustomAttribute {
	const host = NODE_TO_HOST_MAP.get(node);
	if (host == null) {
		throw new ReferenceError(`Internal Error: A host could not be retrieved for node with tagName: ${node.nodeName}`);
	}
	return host;
}