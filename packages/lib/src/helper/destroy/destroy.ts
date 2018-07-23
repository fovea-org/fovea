import {IFoveaHost, ICustomAttribute} from "@fovea/common";
import {UPGRADED_HOSTS} from "../../host/upgraded-hosts/upgraded-hosts";
import {CONSTRUCTED_HOSTS} from "../../host/constructed-hosts/constructed-hosts";
import {disposeOrDestroyShared} from "../dispose/dispose-or-destroy-shared";

/**
 * Destroys a host
 * @param {IFoveaHost|ICustomAttribute} host
 * @private
 */
export function __destroy (host: IFoveaHost|ICustomAttribute): void {
	disposeOrDestroyShared(host);

	// If it has been upgraded, destroy upgraded features
	if (UPGRADED_HOSTS.has(host)) {
		UPGRADED_HOSTS.popAll(host, destroyable => destroyable.destroy());
	}

	// If it has been constructed clear it from maps, stop listening for connection events for custom attributes, etc
	if (CONSTRUCTED_HOSTS.has(host)) {
		CONSTRUCTED_HOSTS.popAll(host, destroyable => destroyable.destroy());
	}
}