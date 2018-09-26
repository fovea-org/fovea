import {FoveaHost} from "@fovea/common";
import {IBoundHostAttributes} from "../bound-host-attributes/i-bound-host-attributes";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Map of all bound host attributes for a host
 * @type {WeakMultiMap<FoveaHost, IBoundHostAttributes>}
 */
export const BOUND_HOST_ATTRIBUTES_FOR_HOST: WeakMultiMap<FoveaHost, IBoundHostAttributes> = new WeakMultiMap();