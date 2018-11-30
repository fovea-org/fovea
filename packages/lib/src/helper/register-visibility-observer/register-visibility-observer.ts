import {FoveaHostConstructor, Json, IVisibilityObserverBaseOptions} from "@fovea/common";
import {addVisibilityObserversForHost} from "../../visibility/host-visibility-observers-for-host/add-visibility-observers-for-host";

/**
 * Registers the provided method for invocation when the host element becomes visible
 * @param {Json} _host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {boolean} visible
 * @param {Partial<IVisibilityObserverBaseOptions>} [options]
 * @private
 */
export function ___registerVisibilityObserver (_host: Json, method: string, isStatic: boolean, visible: boolean, options?: Partial<IVisibilityObserverBaseOptions>): void {
	const host = _host as FoveaHostConstructor;
	const target = options == null || options.target == null ? undefined : options.target;
	addVisibilityObserversForHost(host, {method: {name: method, isStatic}, visible, target});
}