import {NODE_TO_HOST_MAP} from "../node-to-host-map/node-to-host-map";

/**
 * Removes a Node from the map
 * @param {Node} node
 */
export function removeHostForNode (node: Node): void {
	NODE_TO_HOST_MAP.delete(node);
}