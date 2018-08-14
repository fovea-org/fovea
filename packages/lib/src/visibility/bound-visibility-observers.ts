import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {IVisibilityObserverResult} from "./i-visibility-observer-result";
import {WeakMultiMap} from "../multi-map/weak-multi-map";

/**
 * A Map of all active visibility observers for the given host
 * @type {WeakMultiMap<IFoveaHost|ICustomAttribute, IVisibilityObserverResult>}
 */
export const BOUND_VISIBILITY_OBSERVERS: WeakMultiMap<IFoveaHost|ICustomAttribute, IVisibilityObserverResult> = new WeakMultiMap();