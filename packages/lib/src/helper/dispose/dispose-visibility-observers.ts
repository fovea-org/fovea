import {FoveaHost} from "@fovea/common";
import {BOUND_VISIBILITY_OBSERVERS} from "../../visibility/bound-visibility-observers";

/**
 * Disposes all visibility observers for the given host
 * @param {FoveaHost} host
 */
export function ___disposeVisibilityObservers (host: FoveaHost): void {
	if (!BOUND_VISIBILITY_OBSERVERS.has(host)) return;
	BOUND_VISIBILITY_OBSERVERS.popAll(host, observer => observer.unobserve());
}