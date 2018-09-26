import {FoveaHost} from "@fovea/common";
import {WeakMultiMap} from "../../../multi-map/weak-multi-map";
import {IBoundProp} from "../bound-prop/i-bound-prop";

/**
 * A Map of all bound props for a host
 * @type {WeakMultiMap<FoveaHost, IBoundProp>}
 */
export const BOUND_PROPS_FOR_HOST: WeakMultiMap<FoveaHost, IBoundProp> = new WeakMultiMap();