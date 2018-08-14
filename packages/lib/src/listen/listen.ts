import {IListenOptions} from "./i-listen-options";
import {IListenResult} from "./i-listen-result";
import {log} from "../log/log";

/**
 * Starts listening for specific events on some element bound to an IFoveaHost
 * @param {IListenOptions} options
 * @returns {IListenResult}
 * @private
 */
export function listen ({on, host, name, handler, passive, once, rawOn}: IListenOptions): IListenResult {
	// The handler may be a string in which case it should be wrapped inside "new Function"
	// noinspection SuspiciousTypeOfGuard
	let bound: ((e: Event) => void)|null = typeof handler === "string"
		? function (e: Event) {
			new Function("event", handler).call(host, e);
		}
		: function (e: Event) {
			handler.call(host, e, name);
		};

	// Assert that there s a target
	if (on == null) {
		log(`The host:`, host, `declares an event listener for events of kind: '${name}', but the provided target element:`, rawOn, `couldn't be found!`);
		return {
			host, name, unobserve: () => {
			}
		};
	}

	on.addEventListener(name, bound, {passive, ...(once == null ? {} : {once})});
	return {
		host,
		name,
		unobserve: () => {
			on.removeEventListener(name, bound);
			if (bound != null) {
				bound = null;
			}
		}
	};
}