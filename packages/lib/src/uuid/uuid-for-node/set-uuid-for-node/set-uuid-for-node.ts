import {NODE_TO_UUID_MAP} from "../node-to-uuid-map/node-to-uuid-map";
import {ICustomAttribute, Uuid} from "@fovea/common";

/**
 * Maps a Node to its host
 * @param {Node|ICustomAttribute} node
 * @param {Uuid} uuid
 */
export function setUuidForNode (node: Node|ICustomAttribute, uuid: Uuid): void {
	NODE_TO_UUID_MAP.set(node, uuid);
}