import {FoveaHost, WeakMultiMap} from "@fovea/common";
import {IVisibilityObserverResult} from "./i-visibility-observer-result";

/**
 * A Map of all active visibility observers for the given host
 * @type {WeakMultiMap<FoveaHost, IVisibilityObserverResult>}
 */
export const BOUND_VISIBILITY_OBSERVERS: WeakMultiMap<FoveaHost, IVisibilityObserverResult> = new WeakMultiMap();