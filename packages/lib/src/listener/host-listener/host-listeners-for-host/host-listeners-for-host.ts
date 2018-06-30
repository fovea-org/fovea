import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {IHostListenerOptions} from "../host-listener-options/i-host-listener-options";
import {WeakMultiMap} from "../../../multi-map/weak-multi-map";

/*# IF hasHostListeners */

/**
 * A Map between IFoveaHostConstructors and the Set of all IHostListenerOptions
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IHostListenerOptions>>}
 */
export const HOST_LISTENERS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IHostListenerOptions>> = new WeakMultiMap(); /*# END IF hasHostListeners */