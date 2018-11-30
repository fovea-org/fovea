import {FoveaHostConstructor, Json} from "@fovea/common";
import {HostAttributesCallback} from "../../host-attributes/host-attributes-callback/host-attributes-callback";
import {addHostAttributesForHost} from "../../host-attributes/add-host-attributes-for-host/add-host-attributes-for-host";

/**
 * Registers host attributes for a host
 * @param {Function} hostAttributes
 * @param {Json} _host
 * @private
 */
export function ___registerHostAttributes (hostAttributes: HostAttributesCallback, _host: Json): void {
	const host = _host as FoveaHostConstructor;
	addHostAttributesForHost(host, hostAttributes);
}