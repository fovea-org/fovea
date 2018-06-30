import {ICustomAttributeConstructor, IFoveaHostConstructor, IHostProp} from "@fovea/common";
import {HOST_PROPS_FOR_HOST} from "./host-props-for-host";

/*# IF hasHostProps */

/**
 * Maps the given host prop(s) to the host, indicating that they should be set on the host as attributes when they receive a value
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @param {IHostProp | IHostProp[]} hostProp
 */
export function addHostPropsForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor, hostProp: IHostProp[]|IHostProp): void {
	// Add the hostProp(s) to the array of host props for the host
	HOST_PROPS_FOR_HOST.add(host, ...(Array.isArray(hostProp) ? hostProp : [hostProp]));
} /*# END IF hasHostProps */