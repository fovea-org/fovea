import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {downgradeHost} from "../../host/downgrade-host/downgrade-host";

/**
 * Invoked when a host is disposed (e.g. the 'disconnectedCallback' is fired)
 * @param {IFoveaHost|ICustomAttribute} host
 * @private
 */
export function __dispose (host: IFoveaHost|ICustomAttribute): void {
	// Downgrade the host
	downgradeHost(host);
}