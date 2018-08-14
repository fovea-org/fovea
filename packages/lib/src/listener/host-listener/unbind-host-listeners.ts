import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {BOUND_HOST_LISTENERS} from "./bound-host-listeners";

/**
 * Deactivates all host listeners for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function unbindHostListeners (host: IFoveaHost|ICustomAttribute): void {
	if (!BOUND_HOST_LISTENERS.has(host)) return;
	BOUND_HOST_LISTENERS.popAll(host, listener => listener.unobserve());
}