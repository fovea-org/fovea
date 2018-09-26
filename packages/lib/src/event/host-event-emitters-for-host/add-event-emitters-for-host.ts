import {FoveaHostConstructor} from "@fovea/common";
import {IEventEmitterOptions} from "../event-emitter/i-event-emitter-options";
import {EVENT_EMITTERS_FOR_HOST} from "./event-emitters-for-host";

/**
 * Maps the given host event emitters(s) to the host, indicating that they should be fired when a prop on the host changes
 * @param {FoveaHostConstructor} host
 * @param {Partial<IEventEmitterOptions> | Partial<IEventEmitterOptions>[]} eventEmitter
 */
export function addEventEmittersForHost (host: FoveaHostConstructor, eventEmitter: Partial<IEventEmitterOptions>[]|Partial<IEventEmitterOptions>): void {
	// Add the eventEmitter(s) to the array of event emitters for the host
	EVENT_EMITTERS_FOR_HOST.add(host, ...(Array.isArray(eventEmitter) ? eventEmitter : [eventEmitter]));
}