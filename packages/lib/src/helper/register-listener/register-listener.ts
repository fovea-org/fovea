import {FoveaHostConstructor, IHostListenerBaseOptions, Json} from "@fovea/common";
import {addHostListenersForHost} from "../../listener/host-listener/host-listeners-for-host/add-host-listeners-for-host";

/**
 * Registers a host listener for the given host and method
 * @param {Json} _host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {string|string[]} name
 * @param {Partial<IHostListenerBaseOptions>} options
 * @private
 */
export function ___registerListener (_host: Json, method: string, isStatic: boolean, name: string|string[], options?: Partial<IHostListenerBaseOptions>): void {
	const host = _host as FoveaHostConstructor;
	const passive = options == null || options.passive == null ? undefined : options.passive;
	const once = options == null || options.once == null ? false : options.once;
	const condition = options == null || options.condition == null ? true : options.condition;
	const on = options == null || options.on == null ? undefined : options.on;
	const eventNames = Array.isArray(name) ? name : [name];

	// Add all of them
	eventNames.forEach(eventName => addHostListenersForHost(host, {eventName, passive, once, on, condition, method: {name: method, isStatic}}));
}