import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {IEventEmitterOptions} from "../event-emitter/i-event-emitter-options";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/*# IF hasEventEmitters */

/**
 * A Map between IFoveaHostConstructors and the Set of all events that should be fired when the associated prop changes
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IEventEmitterOptions>[]>}
 */
export const EVENT_EMITTERS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Partial<IEventEmitterOptions>> = new WeakMultiMap(); /*# END IF hasEventEmitters */