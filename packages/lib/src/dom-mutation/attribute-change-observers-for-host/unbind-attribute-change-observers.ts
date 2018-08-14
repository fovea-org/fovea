import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {BOUND_ATTRIBUTE_CHANGE_OBSERVERS} from "./bound-attribute-change-observers";

/**
 * Deactivates all attribute change observers for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function unbindAttributeChangeObservers (host: IFoveaHost|ICustomAttribute): void {
	if (!BOUND_ATTRIBUTE_CHANGE_OBSERVERS.has(host)) return;
	BOUND_ATTRIBUTE_CHANGE_OBSERVERS.popAll(host, observer => observer.unobserve());
}