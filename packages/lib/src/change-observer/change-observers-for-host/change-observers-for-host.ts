import {FoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IChangeObserver} from "../i-change-observer";

/**
 * A Map between FoveaHostConstructors and the Set of all IChangeObservers
 * @type {WeakMultiMap<FoveaHostConstructor, IChangeObserver>}
 */
export const CHANGE_OBSERVERS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, IChangeObserver> = new WeakMultiMap();