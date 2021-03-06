import {FoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IVisibilityObserver} from "../i-visibility-observer";

/**
 * A Map between FoveaHostConstructors and the Set of all IVisibilityObservers for them
 * @type {WeakMultiMap<FoveaHostConstructor, Partial<IVisibilityObserver>>}
 */
export const VISIBILITY_OBSERVERS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, Partial<IVisibilityObserver>> = new WeakMultiMap();