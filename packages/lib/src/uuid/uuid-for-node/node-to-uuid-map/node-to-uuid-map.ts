import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHostConstructor, Uuid} from "@fovea/common";

/**
 * A map between Nodes and their UUIDs.
 * @type {WeakMap<Node|ICustomAttribute|IFoveaHostConstructor|ICustomAttributeConstructor, Uuid>}
 */
export const NODE_TO_UUID_MAP: WeakMap<Node|ICustomAttribute|IFoveaHostConstructor|ICustomAttributeConstructor, Uuid> = new WeakMap();