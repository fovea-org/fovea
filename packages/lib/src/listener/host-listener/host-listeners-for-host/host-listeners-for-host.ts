import {FoveaHostConstructor, WeakMultiMap} from "@fovea/common";
import {IHostListenerOptions} from "../host-listener-options/i-host-listener-options";

/**
 * A Map between FoveaHostConstructors and the Set of all IHostListenerOptions
 * @type {WeakMultiMap<FoveaHostConstructor, Partial<IHostListenerOptions>>}
 */
export const HOST_LISTENERS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, Partial<IHostListenerOptions>> = new WeakMultiMap();