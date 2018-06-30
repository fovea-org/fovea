import {IListenOptions} from "./i-listen-options";
import {IListenResult} from "./i-listen-result";

/*# IF hasTemplateListeners || hasHostListeners */

/**
 * Starts listening for specific events on some element bound to an IFoveaHost
 * @param {EventTarget} on
 * @param {IFoveaHost} host
 * @param {string} name
 * @param {Function} handler
 * @param {boolean} passive
 * @param {boolean} once
 * @returns {IListenResult}
 * @private
 */
export function listen ({on, host, name, handler, passive, once}: IListenOptions): IListenResult {
	// The handler may be a string in which case it should be wrapped inside "new Function"
	// noinspection SuspiciousTypeOfGuard
	const bound = typeof handler === "string"
		? function (e: Event) { new Function("event", handler).call(host, e); }
		: function (e: Event) { handler.call(host, e, name); };
	on.addEventListener(name, bound, {passive, ...(once == null ? {} : {once})});
	return {host, name, unobserve: () => on.removeEventListener(name, bound)};
} /*# END IF hasTemplateListeners || hasHostListeners */