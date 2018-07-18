import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {BOUND_CHILD_LIST_OBSERVERS} from "./bound-child-list-observers";

/*# IF hasChildListObservers */

/**
 * Deactivates all child list observers for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function unbindChildListObservers (host: IFoveaHost|ICustomAttribute): void {
	BOUND_CHILD_LIST_OBSERVERS.popAll(host, observer => observer.unobserve());
} /*# END IF hasChildListObservers */