import {FoveaHost} from "@fovea/common";
import {CONSTRUCTED_HOSTS} from "../../host/constructed-hosts/constructed-hosts";
import {disposeOrDestroyShared} from "../dispose/dispose-or-destroy-shared";

/**
 * Destroys a host
 * @param {FoveaHost} host
 * @private
 */
export function ___destroy (host: FoveaHost): void {
	disposeOrDestroyShared(host);
	if (host.___destroyTemplates != null) host.___destroyTemplates();

	// If it has been constructed clear it from maps, stop listening for connection events for custom attributes, etc
	if (CONSTRUCTED_HOSTS.has(host)) {
		CONSTRUCTED_HOSTS.popAll(host, destroyable => destroyable.destroy());
	}
}