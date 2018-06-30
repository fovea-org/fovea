import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {NODE_TO_HOST_MAP} from "../node-to-host-map/node-to-host-map";

/**
 * Maps a Node to its host
 * @param {Node} node
 * @param {IFoveaHost|ICustomAttribute} host
 */
export function setHostForNode (node: Node, host: IFoveaHost|ICustomAttribute): void {
	NODE_TO_HOST_MAP.set(node, host);
}