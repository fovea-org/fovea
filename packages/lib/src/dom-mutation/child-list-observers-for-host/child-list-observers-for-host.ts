import {FoveaHostConstructor, WeakMultiMap} from "@fovea/common";
import {IChildListObserver} from "./i-child-list-observer";

/**
 * A Map between FoveaHostConstructors and the Set of all IChildListObservers for them
 * @type {WeakMultiMap<FoveaHostConstructor, Partial<IChildListObserver>>}
 */
export const CHILD_LIST_OBSERVERS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, Partial<IChildListObserver>> = new WeakMultiMap();