import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {IEventEmitterOptions} from "../event-emitter/i-event-emitter-options";
import {EVENT_EMITTERS_FOR_HOST} from "./event-emitters-for-host";

/*# IF hasEventEmitters */

/**
 * Maps the given host event emitters(s) to the host, indicating that they should be fired when a prop on the host changes
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @param {Partial<IEventEmitterOptions> | Partial<IEventEmitterOptions>[]} eventEmitter
 */
export function addEventEmittersForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor, eventEmitter: Partial<IEventEmitterOptions>[]|Partial<IEventEmitterOptions>): void {
	// Add the eventEmitter(s) to the array of event emitters for the host
	EVENT_EMITTERS_FOR_HOST.add(host, ...(Array.isArray(eventEmitter) ? eventEmitter : [eventEmitter]));
} /*# END IF hasEventEmitters */