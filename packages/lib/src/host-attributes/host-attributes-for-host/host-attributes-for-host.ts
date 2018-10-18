import {FoveaHostConstructor, WeakMultiMap} from "@fovea/common";
import {HostAttributesCallback} from "../host-attributes-callback/host-attributes-callback";

/**
 * A map between hosts and their host attributes
 * @type {WeakMultiMap<FoveaHostConstructor, HostAttributesCallback>}
 */
export const HOST_ATTRIBUTES_FOR_HOST: WeakMultiMap<FoveaHostConstructor, HostAttributesCallback> = new WeakMultiMap();