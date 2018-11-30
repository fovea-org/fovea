import {FoveaHostConstructor, Json} from "@fovea/common";
import {addChangeObserversForHost} from "../../change-observer/change-observers-for-host/add-change-observers-for-host";

/**
 * Registers a method to be invoked when any of the provided props change
 * @param {Json} _host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {string | string[]} props
 * @param {boolean} [whenAllAreInitialized=false]
 * @private
 */
export function ___registerChangeObserver (_host: Json, method: string, isStatic: boolean, props: string|string[], whenAllAreInitialized: boolean = false): void {
	const host = _host as FoveaHostConstructor;
	const propNames = Array.isArray(props) ? props : [props];

	// Add the ChangeObserver
	addChangeObserversForHost(host, {whenAllAreInitialized, props: propNames, method: {name: method, isStatic}});
}