import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {addChangeObserversForHost} from "../../change-observer/change-observers-for-host/add-change-observers-for-host";

/*# IF hasChangeObservers */

/**
 * Registers a method to be invoked when any of the provided props change
 * @param {IFoveaHostConstructor | ICustomAttributeConstructor} host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {string | string[]} props
 * @param {boolean} [whenConnected=true]
 * @param {boolean} [whenAllAreInitialized=false]
 * @private
 */
export function __registerChangeObserver (host: IFoveaHostConstructor|ICustomAttributeConstructor, method: string, isStatic: boolean, props: string|string[], whenConnected: boolean = true, whenAllAreInitialized: boolean = false): void {
	const propNames = Array.isArray(props) ? props : [props];

	// Add the ChangeObserver
	addChangeObserversForHost(host, {whenAllAreInitialized, whenConnected, props: propNames, method: {name: method, isStatic}});
} /*# END IF hasChangeObservers */