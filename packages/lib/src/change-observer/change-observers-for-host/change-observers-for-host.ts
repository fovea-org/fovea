import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IChangeObserver} from "../i-change-observer";

/**
 * A Map between IFoveaHostConstructors and the Set of all IChangeObservers
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, IChangeObserver>}
 */
export const CHANGE_OBSERVERS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, IChangeObserver> = new WeakMultiMap();