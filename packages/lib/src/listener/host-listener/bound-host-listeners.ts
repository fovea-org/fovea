import {IListenResult} from "../../listen/i-listen-result";
import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Map of all active host listeners for the given host
 * @type {WeakMultiMap<IFoveaHost|ICustomAttribute, IListenResult[]>}
 */
export const BOUND_HOST_LISTENERS: WeakMultiMap<IFoveaHost|ICustomAttribute, IListenResult> = new WeakMultiMap();