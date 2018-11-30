import {FoveaHost, Json} from "@fovea/common";
import {BOUND_HOST_LISTENERS} from "../../listener/host-listener/bound-host-listeners";
import {ricScheduler} from "@fovea/scheduler";

/**
 * Disposes all host listeners for the given host some time in the future
 * @param {Json} _host
 */
export function ___disposeListeners (_host: Json): void {
	const host = _host as FoveaHost;
	ricScheduler.mutate(disposeListeners.bind(null, host)).then();
}

/**
 * Disposes all host listeners for the given host
 * @param {FoveaHost} host
 */
function disposeListeners (host: FoveaHost): void {
	if (!BOUND_HOST_LISTENERS.has(host)) return;
	BOUND_HOST_LISTENERS.popAll(host, listener => listener.unobserve());
}