import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {HOST_LISTENERS_FOR_HOST} from "./host-listeners-for-host";

/**
 * Adds all the host listeners of the parent of the given IFoveaHostConstructor or ICustomAttributeConstructor to the set of all host listeners for the given host
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentHostListenersForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (HOST_LISTENERS_FOR_HOST.has(parent)) {

		// Add all of the host listeners of the parent to the host listeners of the host if it doesn't include them already
		HOST_LISTENERS_FOR_HOST.add(host, ...HOST_LISTENERS_FOR_HOST.get(parent));
	}
}