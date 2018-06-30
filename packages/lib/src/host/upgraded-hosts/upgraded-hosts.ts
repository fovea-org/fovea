import {UpgradedHostsMap} from "./upgraded-hosts-map";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Set of all IFoveaHosts that has been upgraded.
 * @type {UpgradedHostsMap}
 */
export const UPGRADED_HOSTS: UpgradedHostsMap = new WeakMultiMap();