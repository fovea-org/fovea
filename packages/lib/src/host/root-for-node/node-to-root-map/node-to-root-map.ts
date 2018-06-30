import {ICustomAttribute} from "@fovea/common";

/**
 * A map between Nodes and their Shadow roots
 * @type {WeakMap<Node, ShadowRoot|Element>}
 */
export const NODE_TO_ROOT_MAP: WeakMap<Node|ICustomAttribute, ShadowRoot|Element> = new WeakMap();