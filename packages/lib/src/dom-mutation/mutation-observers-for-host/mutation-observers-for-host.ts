import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {IMutationObserver} from "../i-mutation-observer";

/*# IF hasMutationObservers */

/**
 * A Map between IFoveaHostConstructors and the Set of all IMutationObservers for them
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IMutationObserver>>}
 */
export const MUTATION_OBSERVERS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IMutationObserver>> = new WeakMultiMap(); /*# END IF hasMutationObservers */