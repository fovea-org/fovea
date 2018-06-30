import {NODE_TO_UUID_MAP} from "../node-to-uuid-map/node-to-uuid-map";
import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHostConstructor, Uuid} from "@fovea/common";

/**
 * Gets the UUID for a Node
 * @param {Node|ICustomAttribute} node
 * @returns {Uuid?}
 */
export function getUuidForNode (node: Node|ICustomAttribute|IFoveaHostConstructor|ICustomAttributeConstructor): Uuid|undefined {
	return NODE_TO_UUID_MAP.get(node);
}