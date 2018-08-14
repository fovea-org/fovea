import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {VISIBILITY_OBSERVERS_FOR_HOST} from "./visibility-observers-for-host";

/**
 * Adds all the visibility observers of the parent of the given IFoveaHostConstructor or ICustomAttributeConstructor to the set of all visibility observers for the host
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentVisibilityObserversForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (VISIBILITY_OBSERVERS_FOR_HOST.has(parent)) {
		// Add all of the visibility observers of the parent to the visibility observers of the host if it doesn't include them already
		VISIBILITY_OBSERVERS_FOR_HOST.add(host, ...VISIBILITY_OBSERVERS_FOR_HOST.get(parent));
	}
}