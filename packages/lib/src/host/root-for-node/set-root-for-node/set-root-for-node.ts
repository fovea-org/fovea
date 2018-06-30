import {NODE_TO_ROOT_MAP} from "../node-to-root-map/node-to-root-map";
import {ICustomAttribute} from "@fovea/common";

/**
 * Maps a Node to its ShadowRoot
 * @param {Node|ICustomAttribute} node
 * @param {Element|ShadowRoot} root
 */
export function setRootForNode (node: Node|ICustomAttribute, root: Element|ShadowRoot): void {
	NODE_TO_ROOT_MAP.set(node, root);
}