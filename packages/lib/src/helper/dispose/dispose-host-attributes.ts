import {FoveaHost} from "@fovea/common";
import {BOUND_HOST_ATTRIBUTES_FOR_HOST} from "../../host-attributes/bound-host-attributes-for-host/bound-host-attributes-for-host";

/**
 * Disposes all host attributes from the given host
 * @param {FoveaHost} host
 */
export function ___disposeHostAttributes (host: FoveaHost): void {
	if (!BOUND_HOST_ATTRIBUTES_FOR_HOST.has(host)) return;
	BOUND_HOST_ATTRIBUTES_FOR_HOST.popAll(host, observer => observer.destroy());
}