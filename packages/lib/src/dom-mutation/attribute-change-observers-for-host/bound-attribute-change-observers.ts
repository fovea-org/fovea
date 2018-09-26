import {FoveaHost} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IAttributeChangeObserverResult} from "./i-attribute-change-observer-result";

/**
 * A Map of all active attribute change observers for the given host
 * @type {WeakMultiMap<FoveaHost, IAttributeChangeObserverResult>}
 */
export const BOUND_ATTRIBUTE_CHANGE_OBSERVERS: WeakMultiMap<FoveaHost, IAttributeChangeObserverResult> = new WeakMultiMap();