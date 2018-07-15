import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {HOST_ATTRIBUTES_FOR_HOST} from "../host-attributes-for-host/host-attributes-for-host";

/*# IF hasHostAttributes */

/**
 * Adds all the host attribute callbacks of the parent of the given IFoveaHostConstructor or ICustomAttributeConstructor to the set of all host attribute callbacks.
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentHostAttributesForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (HOST_ATTRIBUTES_FOR_HOST.has(parent)) {
		// Add all of the host attributes of the parent to the host attributes of the host
		HOST_ATTRIBUTES_FOR_HOST.add(host, ...HOST_ATTRIBUTES_FOR_HOST.get(parent));
	}
} /*# END IF hasHostAttributes */