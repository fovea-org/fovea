import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {UPGRADED_HOSTS} from "../../host/upgraded-hosts/upgraded-hosts";

/**
 * Disposes all templates from the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function ___disposeTemplates (host: IFoveaHost|ICustomAttribute): void {
	// Take all TemplateResults for the host and dispose them.
	if (UPGRADED_HOSTS.has(host)) {
		UPGRADED_HOSTS.popAll(host, disposable => disposable.dispose());
	}
}