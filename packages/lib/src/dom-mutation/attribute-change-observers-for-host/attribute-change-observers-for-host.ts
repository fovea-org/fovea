import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IAttributeChangeObserver} from "./i-attribute-change-observer";

/**
 * A Map between IFoveaHostConstructors and the Set of all IAttributeChangeObservers
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IAttributeChangeObserver>>}
 */
export const ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IAttributeChangeObserver>> = new WeakMultiMap();