import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {IMutationObserver} from "../i-mutation-observer";
import {MUTATION_OBSERVERS_FOR_HOST} from "./mutation-observers-for-host";

/*# IF hasMutationObservers */

/**
 * Maps the given host mutation observer(s) to the host, indicating that their contained methods should be invoked when the host element receives or loses children
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @param {Partial<IMutationObserver> | Partial<IMutationObserver>[]} mutationObservers
 */
export function addMutationObserversForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor, mutationObservers: Partial<IMutationObserver>[]|Partial<IMutationObserver>): void {
	// Add the mutation observer(s) to the array of visibility observers for the host
	MUTATION_OBSERVERS_FOR_HOST.add(host, ...(Array.isArray(mutationObservers) ? mutationObservers : [mutationObservers]));
} /*# END IF hasVisibilityObservers */