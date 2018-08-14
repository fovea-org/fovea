import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IVisibilityObserver} from "../i-visibility-observer";

/**
 * A Map between IFoveaHostConstructors and the Set of all IVisibilityObservers for them
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IVisibilityObserver>>}
 */
export const VISIBILITY_OBSERVERS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IVisibilityObserver>> = new WeakMultiMap();