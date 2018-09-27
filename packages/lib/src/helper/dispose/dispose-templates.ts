import {FoveaHost} from "@fovea/common";
import {UPGRADED_HOSTS} from "../../host/upgraded-hosts/upgraded-hosts";
import {ricScheduler} from "@fovea/scheduler";

/**
 * Disposes all templates from the given host some time in the future
 * @param {FoveaHost} host
 */
export function ___disposeTemplates (host: FoveaHost): void {
	// Take all TemplateResults for the host and dispose them.
	ricScheduler.mutate(disposeTemplates.bind(null, host)).then();
}

/**
 * Disposes all templates from the given host
 * @param {FoveaHost} host
 */
function disposeTemplates (host: FoveaHost): void {
	// Take all TemplateResults for the host and dispose them.
	UPGRADED_HOSTS.popAll(host, disposable => disposable.dispose());
}