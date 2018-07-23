import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {ConstructedHostsMap} from "./constructed-hosts-map";

/**
 * A Set of all IFoveaHosts that has been constructed.
 * @type {ConstructedHostsMap}
 */
export const CONSTRUCTED_HOSTS: ConstructedHostsMap = new WeakMultiMap();