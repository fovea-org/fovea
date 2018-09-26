import {FoveaHost} from "@fovea/common";
import {UPGRADED_HOSTS} from "../upgraded-hosts/upgraded-hosts";

/**
 * Returns true if the host has been upgraded.
 * @param {FoveaHost} host
 * @returns {boolean}
 */
export function isUpgraded (host: FoveaHost): boolean {
	return UPGRADED_HOSTS.has(host);
}