import {ICustomAttribute, IFoveaHost} from "@fovea/common";

/**
 * A map between IFoveaHosts or ICustomAttributes and their host elements
 * @type {Map<IFoveaHost|ICustomAttribute, Element>}
 */
export const HOST_TO_HOST_ELEMENT_MAP: WeakMap<IFoveaHost|ICustomAttribute, Element> = new WeakMap();