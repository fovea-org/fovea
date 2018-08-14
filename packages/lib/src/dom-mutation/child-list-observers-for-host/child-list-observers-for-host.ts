import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IChildListObserver} from "./i-child-list-observer";

/**
 * A Map between IFoveaHostConstructors and the Set of all IChildListObservers for them
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IChildListObserver>>}
 */
export const CHILD_LIST_OBSERVERS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IChildListObserver>> = new WeakMultiMap();