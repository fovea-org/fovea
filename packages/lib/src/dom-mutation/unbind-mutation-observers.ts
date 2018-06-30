import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {BOUND_MUTATION_OBSERVERS} from "./bound-mutation-observers";

/*# IF hasMutationObservers */

/**
 * Deactivates all mutation observers for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function unbindMutationObservers (host: IFoveaHost|ICustomAttribute): void {
	BOUND_MUTATION_OBSERVERS.popAll(host, observer => observer.unobserve());
} /*# END IF hasMutationObservers */