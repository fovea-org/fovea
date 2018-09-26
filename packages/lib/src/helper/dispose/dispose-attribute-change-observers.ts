import {FoveaHost} from "@fovea/common";
import {BOUND_ATTRIBUTE_CHANGE_OBSERVERS} from "../../dom-mutation/attribute-change-observers-for-host/bound-attribute-change-observers";

/**
 * Disposes all attribute change observers for the given host
 * @param {FoveaHost} host
 */
export function ___disposeAttributeChangeObservers (host: FoveaHost): void {
	if (!BOUND_ATTRIBUTE_CHANGE_OBSERVERS.has(host)) return;
	BOUND_ATTRIBUTE_CHANGE_OBSERVERS.popAll(host, observer => observer.unobserve());
}