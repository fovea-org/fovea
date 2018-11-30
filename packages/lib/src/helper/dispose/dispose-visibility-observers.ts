import {FoveaHost, Json} from "@fovea/common";
import {BOUND_VISIBILITY_OBSERVERS} from "../../visibility/bound-visibility-observers";

/**
 * Disposes all visibility observers for the given host
 * @param {Json} _host
 */
export function ___disposeVisibilityObservers (_host: Json): void {
	const host = _host as FoveaHost;
	if (!BOUND_VISIBILITY_OBSERVERS.has(host)) return;
	BOUND_VISIBILITY_OBSERVERS.popAll(host, observer => observer.unobserve());
}