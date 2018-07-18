import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IAttributeChangeObserverResult} from "./i-attribute-change-observer-result";

/*# IF hasAttributeChangeObservers */

/**
 * A Map of all active attribute change observers for the given host
 * @type {WeakMultiMap<IFoveaHost|ICustomAttribute, IAttributeChangeObserverResult>}
 */
export const BOUND_ATTRIBUTE_CHANGE_OBSERVERS: WeakMultiMap<IFoveaHost|ICustomAttribute, IAttributeChangeObserverResult> = new WeakMultiMap(); /*# END IF hasAttributeChangeObservers */