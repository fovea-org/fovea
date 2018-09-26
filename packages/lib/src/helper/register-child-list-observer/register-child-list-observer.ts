import {FoveaHostConstructor, IMutationObserverBaseOptions} from "@fovea/common";
import {addChildListObserversForHost} from "../../dom-mutation/child-list-observers-for-host/add-child-list-observers-for-host";

/**
 * Registers the provided method for invocation when the host element or the given target receives or loses children
 * @param {FoveaHostConstructor} host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {boolean} added
 * @param {Partial<IMutationObserverBaseOptions>} [options]
 * @private
 */
export function ___registerChildListObserver (host: FoveaHostConstructor, method: string, isStatic: boolean, added: boolean, options?: Partial<IMutationObserverBaseOptions>): void {
	const target = options == null || options.target == null ? undefined : options.target;
	addChildListObserversForHost(host, {method: {name: method, isStatic}, added, target});
}