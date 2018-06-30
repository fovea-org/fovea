import {ICustomAttributeConstructor, IFoveaHostConstructor, IMutationObserverBaseOptions} from "@fovea/common";
import {addMutationObserversForHost} from "../../dom-mutation/mutation-observers-for-host/add-mutation-observers-for-host";

/*# IF hasMutationObservers */

/**
 * Registers the provided method for invocation when the host element or the given target receives or loses children
 * @param {IFoveaHostConstructor | ICustomAttributeConstructor} host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {boolean} added
 * @param {Partial<IMutationObserverBaseOptions>} [options]
 * @private
 */
export function __registerMutationObserver (host: IFoveaHostConstructor|ICustomAttributeConstructor, method: string, isStatic: boolean, added: boolean, options?: Partial<IMutationObserverBaseOptions>): void {
	const target = options == null || options.target == null ? undefined : options.target;
	addMutationObserversForHost(host, {method: {name: method, isStatic}, added, target});
} /*# END IF hasMutationObservers */