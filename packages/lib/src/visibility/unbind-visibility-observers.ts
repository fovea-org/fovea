import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {BOUND_VISIBILITY_OBSERVERS} from "./bound-visibility-observers";

/*# IF hasVisibilityObservers */

/**
 * Deactivates all visibility observers for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function unbindVisibilityObservers (host: IFoveaHost|ICustomAttribute): void {
	BOUND_VISIBILITY_OBSERVERS.popAll(host, observer => observer.unobserve());
} /*# END IF hasVisibilityObservers */