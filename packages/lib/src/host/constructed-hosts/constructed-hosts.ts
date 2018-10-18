import {WeakMultiMap} from "@fovea/common";
import {ConstructedHostsMap} from "./constructed-hosts-map";

/**
 * A Set of all FoveaHosts that has been constructed.
 * @type {ConstructedHostsMap}
 */
export const CONSTRUCTED_HOSTS: ConstructedHostsMap = new WeakMultiMap();