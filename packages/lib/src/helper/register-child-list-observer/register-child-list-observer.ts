import {FoveaHostConstructor, IMutationObserverBaseOptions, Json} from "@fovea/common";
import {addChildListObserversForHost} from "../../dom-mutation/child-list-observers-for-host/add-child-list-observers-for-host";

/**
 * Registers the provided method for invocation when the host element or the given target receives or loses children
 * @param {Json} _host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {boolean} added
 * @param {Partial<IMutationObserverBaseOptions>} [options]
 * @private
 */
export function ___registerChildListObserver (_host: Json, method: string, isStatic: boolean, added: boolean, options?: Partial<IMutationObserverBaseOptions>): void {
	const host = _host as FoveaHostConstructor;
	const target = options == null || options.target == null ? undefined : options.target;
	addChildListObserversForHost(host, {method: {name: method, isStatic}, added, target});
}