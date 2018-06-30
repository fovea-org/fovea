import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {UPGRADED_HOSTS} from "../upgraded-hosts/upgraded-hosts";

/**
 * Returns true if the host has been upgraded.
 * @param {IFoveaHost|ICustomAttribute} host
 * @returns {boolean}
 */
export function isUpgraded (host: IFoveaHost|ICustomAttribute): boolean {
	return UPGRADED_HOSTS.has(host);
}