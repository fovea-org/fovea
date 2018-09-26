import {FoveaHostConstructor} from "@fovea/common";
import {VISIBILITY_OBSERVERS_FOR_HOST} from "./visibility-observers-for-host";
import {IVisibilityObserver} from "../i-visibility-observer";

/**
 * Maps the given host visibility observer(s) to the host, indicating that their contained methods should be invoked when the host element becomes (in)visible
 * @param {FoveaHostConstructor} host
 * @param {Partial<IVisibilityObserver> | Partial<IVisibilityObserver>[]} visibilityObservers
 */
export function addVisibilityObserversForHost (host: FoveaHostConstructor, visibilityObservers: Partial<IVisibilityObserver>[]|Partial<IVisibilityObserver>): void {
	// Add the visibility observer(s) to the array of visibility observers for the host
	VISIBILITY_OBSERVERS_FOR_HOST.add(host, ...(Array.isArray(visibilityObservers) ? visibilityObservers : [visibilityObservers]));
}