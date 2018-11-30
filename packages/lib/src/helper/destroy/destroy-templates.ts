import {FoveaHost, Json} from "@fovea/common";
import {UPGRADED_HOSTS} from "../../host/upgraded-hosts/upgraded-hosts";

/**
 * Destroys all templates from the given host
 * @param {Json} _host
 */
export function ___destroyTemplates (_host: Json): void {
	const host = _host as FoveaHost;
	// Take all TemplateResults for the host and destroy them.
	if (UPGRADED_HOSTS.has(host)) {
		UPGRADED_HOSTS.popAll(host, destroyable => destroyable.destroy());
	}
}