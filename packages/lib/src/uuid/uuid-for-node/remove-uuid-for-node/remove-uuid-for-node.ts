import {NODE_TO_UUID_MAP} from "../node-to-uuid-map/node-to-uuid-map";
import {ICustomAttribute} from "@fovea/common";

/**
 * Removes a Node from the uuid map
 * @param {Node|ICustomAttribute} node
 */
export function removeUuidForNode (node: Node|ICustomAttribute): void {
	NODE_TO_UUID_MAP.delete(node);
}