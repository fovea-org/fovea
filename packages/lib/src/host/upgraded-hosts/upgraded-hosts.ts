import {UpgradedHostsMap} from "./upgraded-hosts-map";
import {WeakMultiMap} from "@fovea/common";

/**
 * A Set of all FoveaHosts that has been upgraded.
 * @type {UpgradedHostsMap}
 */
export const UPGRADED_HOSTS: UpgradedHostsMap = new WeakMultiMap();