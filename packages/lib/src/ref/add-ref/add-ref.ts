import {FoveaHost, Json, Ref} from "@fovea/common";
import {IObserver} from "../../observe/i-observer";

/**
 * Binds a Ref to a host, prepended with a '$'
 * @param {FoveaHost} host
 * @param {Element} element
 * @param {Ref} ref
 */
export function addRef (host: FoveaHost, element: Element, ref: Ref): IObserver {
	(<Json>host)[`$${ref}`] = element;
	return {
		unobserve: () => {
			(<Json>host)[`$${ref}`] = null;
		}
	};
}