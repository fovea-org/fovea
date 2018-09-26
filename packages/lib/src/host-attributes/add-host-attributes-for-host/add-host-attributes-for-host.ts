import {FoveaHostConstructor} from "@fovea/common";
import {HostAttributesCallback} from "../host-attributes-callback/host-attributes-callback";
import {HOST_ATTRIBUTES_FOR_HOST} from "../host-attributes-for-host/host-attributes-for-host";

/**
 * Adds the given host attributes callback to the Map of host attribute callbacks for the host
 * @param {FoveaHostConstructor} host
 * @param {HostAttributesCallback} hostAttributes
 */
export function addHostAttributesForHost (host: FoveaHostConstructor, hostAttributes: HostAttributesCallback): void {
	HOST_ATTRIBUTES_FOR_HOST.add(host, hostAttributes);
}