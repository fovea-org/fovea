import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {CHILD_LIST_OBSERVERS_FOR_HOST} from "./child-list-observers-for-host";

/*# IF hasChildListObservers */

/**
 * Adds all the child list observers of the parent of the given IFoveaHostConstructor or ICustomAttributeConstructor to the set of all child list observers for the host
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentChildListObserversForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (CHILD_LIST_OBSERVERS_FOR_HOST.has(parent)) {
		// Add all of the child list observers of the parent to the child list observers of the host if it doesn't include them already
		CHILD_LIST_OBSERVERS_FOR_HOST.add(host, ...CHILD_LIST_OBSERVERS_FOR_HOST.get(parent));
	}
} /*# END IF hasChildListObservers */