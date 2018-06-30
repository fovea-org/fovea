import {ICustomAttribute, IFoveaHost} from "@fovea/common";

/**
 * A map between Nodes and their hosts.
 * @type {WeakMap<Node, IFoveaHost|ICustomAttribute>}
 */
export const NODE_TO_HOST_MAP: WeakMap<Node, IFoveaHost|ICustomAttribute> = new WeakMap();