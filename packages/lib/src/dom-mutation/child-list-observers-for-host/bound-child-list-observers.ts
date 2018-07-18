import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IChildListObserverResult} from "./i-child-list-observer-result";

/*# IF hasChildListObservers */

/**
 * A Map of all active child list observers for the given host
 * @type {WeakMultiMap<IFoveaHost|ICustomAttribute, IChildListObserverResult>}
 */
export const BOUND_CHILD_LIST_OBSERVERS: WeakMultiMap<IFoveaHost|ICustomAttribute, IChildListObserverResult> = new WeakMultiMap(); /*# END IF hasChildListObservers */