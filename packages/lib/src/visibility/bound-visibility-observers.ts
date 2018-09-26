import {FoveaHost} from "@fovea/common";
import {IVisibilityObserverResult} from "./i-visibility-observer-result";
import {WeakMultiMap} from "../multi-map/weak-multi-map";

/**
 * A Map of all active visibility observers for the given host
 * @type {WeakMultiMap<FoveaHost, IVisibilityObserverResult>}
 */
export const BOUND_VISIBILITY_OBSERVERS: WeakMultiMap<FoveaHost, IVisibilityObserverResult> = new WeakMultiMap();