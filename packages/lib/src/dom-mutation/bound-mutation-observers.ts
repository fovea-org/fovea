import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {IMutationObserverResult} from "./i-mutation-observer-result";
import {WeakMultiMap} from "../multi-map/weak-multi-map";

/*# IF hasMutationObservers */

/**
 * A Map of all active mutation observers for the given host
 * @type {WeakMultiMap<IFoveaHost|ICustomAttribute, IMutationObserverResult>}
 */
export const BOUND_MUTATION_OBSERVERS: WeakMultiMap<IFoveaHost|ICustomAttribute, IMutationObserverResult> = new WeakMultiMap(); /*# END IF hasMutationObservers */