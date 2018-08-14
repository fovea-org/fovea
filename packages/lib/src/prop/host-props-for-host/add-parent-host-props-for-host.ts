import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {HOST_PROPS_FOR_HOST} from "./host-props-for-host";

/**
 * Adds all the host props of the parent of the given IFoveaHostConstructor to the set of all props that should be set on the host element as attributes
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentHostPropsForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (HOST_PROPS_FOR_HOST.has(parent)) {
		// Add all of the host props of the parent to the host props of the host if it doesn't include them already
		HOST_PROPS_FOR_HOST.add(host, ...HOST_PROPS_FOR_HOST.get(parent));
	}
}