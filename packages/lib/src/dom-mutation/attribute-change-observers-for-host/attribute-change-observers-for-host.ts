import {FoveaHostConstructor, WeakMultiMap} from "@fovea/common";
import {IAttributeChangeObserver} from "./i-attribute-change-observer";

/**
 * A Map between FoveaHostConstructors and the Set of all IAttributeChangeObservers
 * @type {WeakMultiMap<FoveaHostConstructor, Partial<IAttributeChangeObserver>>}
 */
export const ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, Partial<IAttributeChangeObserver>> = new WeakMultiMap();