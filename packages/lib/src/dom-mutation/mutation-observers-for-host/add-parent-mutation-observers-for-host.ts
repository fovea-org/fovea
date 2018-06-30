import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {MUTATION_OBSERVERS_FOR_HOST} from "./mutation-observers-for-host";

/*# IF hasMutationObservers */

/**
 * Adds all the mutation observers of the parent of the given IFoveaHostConstructor or ICustomAttributeConstructor to the set of all mutation observers for the host
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentMutationObserversForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (MUTATION_OBSERVERS_FOR_HOST.has(parent)) {
		// Add all of the mutation observers of the parent to the mutation observers of the host if it doesn't include them already
		MUTATION_OBSERVERS_FOR_HOST.add(host, ...MUTATION_OBSERVERS_FOR_HOST.get(parent));
	}
} /*# END IF hasMutationObservers */