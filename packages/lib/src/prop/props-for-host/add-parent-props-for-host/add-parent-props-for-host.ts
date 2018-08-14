import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {PROPS_FOR_HOST} from "../props-for-host/props-for-host";

/**
 * Adds all the props of the parent of the given IFoveaHostConstructor or ICustomAttributeConstructor to the set of all props.
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentPropsForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (PROPS_FOR_HOST.has(parent)) {
		// Add all of the props of the parent to the props of the host
		PROPS_FOR_HOST.add(host, ...PROPS_FOR_HOST.get(parent));
	}
}