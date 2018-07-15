import {IFoveaHost, ICustomAttribute, Ref, Json} from "@fovea/common";
import {IObserver} from "../../observe/i-observer";

/*# IF hasTemplateRefs */

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
} /*# END IF hasTemplateRefs */