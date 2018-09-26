import {FoveaHost} from "@fovea/common";
import {BOUND_CHILD_LIST_OBSERVERS} from "../../dom-mutation/child-list-observers-for-host/bound-child-list-observers";

/**
 * Disposes all child list observers for the given host
 * @param {FoveaHost} host
 */
export function ___disposeChildListObservers (host: FoveaHost): void {
	if (!BOUND_CHILD_LIST_OBSERVERS.has(host)) return;
	BOUND_CHILD_LIST_OBSERVERS.popAll(host, observer => observer.unobserve());
}