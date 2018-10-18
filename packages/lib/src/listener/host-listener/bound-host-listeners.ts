import {IListenResult} from "../../listen/i-listen-result";
import {FoveaHost, WeakMultiMap} from "@fovea/common";

/**
 * A Map of all active host listeners for the given host
 * @type {WeakMultiMap<FoveaHost, IListenResult[]>}
 */
export const BOUND_HOST_LISTENERS: WeakMultiMap<FoveaHost, IListenResult> = new WeakMultiMap();