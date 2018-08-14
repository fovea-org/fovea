import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST} from "./attribute-change-observers-for-host";

/**
 * Adds all the attribute change observers of the parent of the given IFoveaHostConstructor or ICustomAttributeConstructor to the set of all attribute change observers for the given host
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentAttributeChangeObserversForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST.has(parent)) {

		// Add all of the attribute change observers of the parent to the attribute change observers of the host if it doesn't include them already
		ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST.add(host, ...ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST.get(parent));
	}
}