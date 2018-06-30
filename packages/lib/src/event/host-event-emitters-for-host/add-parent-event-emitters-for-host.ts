import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {EVENT_EMITTERS_FOR_HOST} from "./event-emitters-for-host";

/*# IF hasEventEmitters */

/**
 * Adds all the event emitters of the parent of the given IFoveaHostConstructor or ICustomAttributeConstructor to the set of all events that should be fired  when a prop changes on the host
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentEventEmittersForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (EVENT_EMITTERS_FOR_HOST.has(parent)) {
		// Add all of the events of the parent to the event emitters of the host if it doesn't include them already
		EVENT_EMITTERS_FOR_HOST.add(host, ...EVENT_EMITTERS_FOR_HOST.get(parent));
	}
} /*# END IF hasEventEmitters */