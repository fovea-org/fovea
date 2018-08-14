import {ICustomAttributeConstructor, IFoveaHostConstructor, IHostProp} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Map between IFoveaHostConstructors and the Set of all props that should be set on the host element
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, IHostProp, IHostProp[]>}
 */
export const HOST_PROPS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, IHostProp> = new WeakMultiMap();