import {ICustomAttributeConstructor, IFoveaHostConstructor, IVisibilityObserverBaseOptions} from "@fovea/common";
import {addVisibilityObserversForHost} from "../../visibility/host-visibility-observers-for-host/add-visibility-observers-for-host";

/**
 * Registers the provided method for invocation when the host element becomes visible
 * @param {IFoveaHostConstructor | ICustomAttributeConstructor} host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {boolean} visible
 * @param {Partial<IVisibilityObserverBaseOptions>} [options]
 * @private
 */
export function __registerVisibilityObserver (host: IFoveaHostConstructor|ICustomAttributeConstructor, method: string, isStatic: boolean, visible: boolean, options?: Partial<IVisibilityObserverBaseOptions>): void {
	const target = options == null || options.target == null ? undefined : options.target;
	addVisibilityObserversForHost(host, {method: {name: method, isStatic}, visible, target});
}