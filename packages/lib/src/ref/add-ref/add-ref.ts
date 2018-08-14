import {ICustomAttribute, IFoveaHost, Json, Ref} from "@fovea/common";
import {IObserver} from "../../observe/i-observer";

/**
 * Binds a Ref to a host, prepended with a '$'
 * @param {IFoveaHost|ICustomAttribute} host
 * @param {Element} element
 * @param {Ref} ref
 */
export function addRef (host: IFoveaHost|ICustomAttribute, element: Element, ref: Ref): IObserver {
	(<Json>host)[`$${ref}`] = element;
	return {
		unobserve: () => {
			(<Json>host)[`$${ref}`] = null;
		}
	};
}