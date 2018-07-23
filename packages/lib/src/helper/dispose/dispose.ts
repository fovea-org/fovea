import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {UPGRADED_HOSTS} from "../../host/upgraded-hosts/upgraded-hosts";
import {disposeOrDestroyShared} from "./dispose-or-destroy-shared";

/**
 * Invoked when a host is disposed (e.g. the 'disconnectedCallback' is fired)
 * @param {IFoveaHost|ICustomAttribute} host
 * @private
 */
export function __dispose (host: IFoveaHost|ICustomAttribute): void {
	disposeOrDestroyShared(host);

	// Take all TemplateResults for the host and dispose them.
	if (UPGRADED_HOSTS.has(host)) {
		UPGRADED_HOSTS.popAll(host, disposable => disposable.dispose());
	}
}