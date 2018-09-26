import {IListenResult} from "../../listen/i-listen-result";
import {FoveaHost} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Map of all active host listeners for the given host
 * @type {WeakMultiMap<FoveaHost, IListenResult[]>}
 */
export const BOUND_HOST_LISTENERS: WeakMultiMap<FoveaHost, IListenResult> = new WeakMultiMap();