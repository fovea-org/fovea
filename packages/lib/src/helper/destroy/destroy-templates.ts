import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {UPGRADED_HOSTS} from "../../host/upgraded-hosts/upgraded-hosts";

/**
 * Destroys all templates from the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function ___destroyTemplates (host: IFoveaHost|ICustomAttribute): void {
	// Take all TemplateResults for the host and destroy them.
	if (UPGRADED_HOSTS.has(host)) {
		UPGRADED_HOSTS.popAll(host, destroyable => destroyable.destroy());
	}
}