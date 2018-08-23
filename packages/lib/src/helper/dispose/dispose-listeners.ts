import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {BOUND_HOST_LISTENERS} from "../../listener/host-listener/bound-host-listeners";

/**
 * Disposes all host listeners for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function ___disposeListeners (host: IFoveaHost|ICustomAttribute): void {
	if (!BOUND_HOST_LISTENERS.has(host)) return;
	BOUND_HOST_LISTENERS.popAll(host, listener => listener.unobserve());
}