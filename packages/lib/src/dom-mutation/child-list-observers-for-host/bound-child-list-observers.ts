import {FoveaHost, WeakMultiMap} from "@fovea/common";
import {IChildListObserverResult} from "./i-child-list-observer-result";

/**
 * A Map of all active child list observers for the given host
 * @type {WeakMultiMap<FoveaHost, IChildListObserverResult>}
 */
export const BOUND_CHILD_LIST_OBSERVERS: WeakMultiMap<FoveaHost, IChildListObserverResult> = new WeakMultiMap();