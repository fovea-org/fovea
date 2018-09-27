import {FoveaHost} from "@fovea/common";
import {BOUND_PROPS_FOR_HOST} from "../../prop/props-for-host/bound-props-for-host/bound-props-for-host";
import {ricScheduler} from "@fovea/scheduler";

/**
 * Disposes all props from the given host some time in the future
 * @param {FoveaHost} host
 */
export function ___disposeProps (host: FoveaHost): void {
	ricScheduler.mutate(disposeProps.bind(null, host)).then();
}

/**
 * Disposes all props from the given host
 * @param {FoveaHost} host
 */
function disposeProps (host: FoveaHost): void {
	if (!BOUND_PROPS_FOR_HOST.has(host)) return;
	BOUND_PROPS_FOR_HOST.popAll(host, observer => observer.unobserve());
}