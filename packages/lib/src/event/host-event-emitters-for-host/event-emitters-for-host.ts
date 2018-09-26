import {FoveaHostConstructor} from "@fovea/common";
import {IEventEmitterOptions} from "../event-emitter/i-event-emitter-options";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Map between FoveaHostConstructors and the Set of all events that should be fired when the associated prop changes
 * @type {WeakMultiMap<FoveaHostConstructor, Partial<IEventEmitterOptions>[]>}
 */
export const EVENT_EMITTERS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, Partial<IEventEmitterOptions>> = new WeakMultiMap();