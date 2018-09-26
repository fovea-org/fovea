import {FoveaHostConstructor, IHostProp} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Map between FoveaHostConstructors and the Set of all props that should be set on the host element
 * @type {WeakMultiMap<FoveaHostConstructor, IHostProp, IHostProp[]>}
 */
export const HOST_PROPS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, IHostProp> = new WeakMultiMap();