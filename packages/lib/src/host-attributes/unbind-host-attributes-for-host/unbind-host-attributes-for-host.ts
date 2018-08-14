import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {BOUND_HOST_ATTRIBUTES_FOR_HOST} from "../bound-host-attributes-for-host/bound-host-attributes-for-host";

/**
 * Unbinds all host attributes from the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function unbindHostAttributesForHost (host: IFoveaHost|ICustomAttribute): void {
	if (!BOUND_HOST_ATTRIBUTES_FOR_HOST.has(host)) return;
	BOUND_HOST_ATTRIBUTES_FOR_HOST.popAll(host, observer => observer.destroy());
}