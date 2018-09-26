import {FoveaHost} from "@fovea/common";
import {BOUND_HOST_LISTENERS} from "../../listener/host-listener/bound-host-listeners";

/**
 * Disposes all host listeners for the given host
 * @param {FoveaHost} host
 */
export function ___disposeListeners (host: FoveaHost): void {
	if (!BOUND_HOST_LISTENERS.has(host)) return;
	BOUND_HOST_LISTENERS.popAll(host, listener => listener.unobserve());
}