import {FoveaHost} from "@fovea/common";
import {BOUND_HOST_ATTRIBUTES_FOR_HOST} from "../../host-attributes/bound-host-attributes-for-host/bound-host-attributes-for-host";
import {ricScheduler} from "@fovea/scheduler";

/**
 * Disposes all host attributes from the given host some time in the future
 * @param {FoveaHost} host
 */
export function ___disposeHostAttributes (host: FoveaHost): void {
	ricScheduler.mutate(disposeHostAttributes.bind(null, host)).then();
}

/**
 * Disposes all host attributes from the given host
 * @param {FoveaHost} host
 */
function disposeHostAttributes (host: FoveaHost): void {
	if (!BOUND_HOST_ATTRIBUTES_FOR_HOST.has(host)) return;
	BOUND_HOST_ATTRIBUTES_FOR_HOST.popAll(host, observer => observer.destroy());
}