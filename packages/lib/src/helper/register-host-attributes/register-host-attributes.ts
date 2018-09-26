import {FoveaHostConstructor} from "@fovea/common";
import {HostAttributesCallback} from "../../host-attributes/host-attributes-callback/host-attributes-callback";
import {addHostAttributesForHost} from "../../host-attributes/add-host-attributes-for-host/add-host-attributes-for-host";

/**
 * Registers host attributes for a host
 * @param {Function} hostAttributes
 * @param {FoveaHostConstructor} host
 * @private
 */
export function ___registerHostAttributes (hostAttributes: HostAttributesCallback, host: FoveaHostConstructor): void {
	addHostAttributesForHost(host, hostAttributes);
}