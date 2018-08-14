import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {IBoundHostAttributes} from "../bound-host-attributes/i-bound-host-attributes";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Map of all bound host attributes for a host
 * @type {WeakMultiMap<IFoveaHost|ICustomAttribute, IBoundHostAttributes>}
 */
export const BOUND_HOST_ATTRIBUTES_FOR_HOST: WeakMultiMap<IFoveaHost|ICustomAttribute, IBoundHostAttributes> = new WeakMultiMap();