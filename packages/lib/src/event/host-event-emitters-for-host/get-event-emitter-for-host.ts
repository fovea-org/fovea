import {FoveaHostConstructor, IHostProp} from "@fovea/common";
import {IEventEmitterOptions} from "../event-emitter/i-event-emitter-options";
import {EVENT_EMITTERS_FOR_HOST} from "./event-emitters-for-host";

/**
 * Returns true if the given host should emit an event when the given prop name changes on the host
 * @param {FoveaHostConstructor} host
 * @param {IHostProp} prop
 * @returns {Partial<IEventEmitterOptions>|undefined}
 */
export function getEventEmitterForHost (host: FoveaHostConstructor, prop: IHostProp): Partial<IEventEmitterOptions>|undefined {

	// Check if any of them is identical
	return EVENT_EMITTERS_FOR_HOST.findValue(host, eventEmitter => eventEmitter.prop != null && eventEmitter.prop.name === prop.name && eventEmitter.prop.isStatic === prop.isStatic);
}