import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {HostAttributesCallback} from "../host-attributes-callback/host-attributes-callback";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/*# IF hasHostAttributes */

/**
 * A map between hosts and their host attributes
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, HostAttributesCallback>}
 */
export const HOST_ATTRIBUTES_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, HostAttributesCallback> = new WeakMultiMap(); /*# END IF hasHostAttributes */