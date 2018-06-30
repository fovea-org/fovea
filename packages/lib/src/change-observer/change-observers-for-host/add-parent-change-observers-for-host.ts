import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {CHANGE_OBSERVERS_FOR_HOST} from "./change-observers-for-host";

/*# IF hasChangeObservers */

/**
 * Adds all the change observers of the parent of the given IFoveaHostConstructor or ICustomAttributeConstructor to the set of all change observers for the given host
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentChangeObserversForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (CHANGE_OBSERVERS_FOR_HOST.has(parent)) {

		// Add all of the change observers of the parent to the change observers of the host if it doesn't include them already
		CHANGE_OBSERVERS_FOR_HOST.add(host, ...CHANGE_OBSERVERS_FOR_HOST.get(parent));
	}
} /*# END IF hasChangeObservers */