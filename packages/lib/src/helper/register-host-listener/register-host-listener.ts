import {ICustomAttributeConstructor, IFoveaHostConstructor, IHostListenerBaseOptions} from "@fovea/common";
import {addHostListenersForHost} from "../../listener/host-listener/host-listeners-for-host/add-host-listeners-for-host";

/*# IF hasHostListeners */

/**
 * Registers a host listener for the given host and method
 * @param {IFoveaHostConstructor | ICustomAttributeConstructor} host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {string|string[]} name
 * @param {Partial<IHostListenerBaseOptions>} options
 * @private
 */
export function __registerHostListener (host: IFoveaHostConstructor|ICustomAttributeConstructor, method: string, isStatic: boolean, name: string|string[], options?: Partial<IHostListenerBaseOptions>): void {
	const passive = options == null || options.passive == null ? undefined : options.passive;
	const once = options == null || options.once == null ? false : options.once;
	const condition = options == null || options.condition == null ? true : options.condition;
	const on = options == null || options.on == null ? undefined : options.on;
	const eventNames = Array.isArray(name) ? name : [name];

	// Add all of them
	eventNames.forEach(eventName => addHostListenersForHost(host, {eventName, passive, once, on, condition, method: {name: method, isStatic}}));
} /*# END IF hasHostListeners */