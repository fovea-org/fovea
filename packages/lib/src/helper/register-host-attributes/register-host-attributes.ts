import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {HostAttributesCallback} from "../../host-attributes/host-attributes-callback/host-attributes-callback";
import {addHostAttributesForHost} from "../../host-attributes/add-host-attributes-for-host/add-host-attributes-for-host";

/*# IF hasHostAttributes */

/**
 * Registers host attributes for a host
 * @param {Function} hostAttributes
 * @param {ICustomAttributeConstructor|IFoveaHostConstructor} host
 * @private
 */
export function __registerHostAttributes (hostAttributes: HostAttributesCallback, host: ICustomAttributeConstructor|IFoveaHostConstructor): void {
	addHostAttributesForHost(host, hostAttributes);
} /*# END IF hasHostAttributes */