import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {IChildListObserver} from "./i-child-list-observer";
import {CHILD_LIST_OBSERVERS_FOR_HOST} from "./child-list-observers-for-host";

/*# IF hasChildListObservers */

/**
 * Maps the given host child list observer(s) to the host, indicating that their contained methods should be invoked when the host element receives or loses children
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @param {Partial<IChildListObserver> | Partial<IChildListObserver>[]} childListObservers
 */
export function addChildListObserversForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor, childListObservers: Partial<IChildListObserver>[]|Partial<IChildListObserver>): void {
	// Add the mutation observer(s) to the array of visibility observers for the host
	CHILD_LIST_OBSERVERS_FOR_HOST.add(host, ...(Array.isArray(childListObservers) ? childListObservers : [childListObservers]));
} /*# END IF hasVisibilityObservers */