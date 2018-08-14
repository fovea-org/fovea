import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {AnyHost} from "../../host/any-host/any-host";

/**
 * A map between hosts and the props that has been initialized on them
 * @type {WeakMultiMap<AnyHost, string>}
 */
export const INITIALIZED_PROPS_FOR_HOST: WeakMultiMap<AnyHost, string> = new WeakMultiMap();