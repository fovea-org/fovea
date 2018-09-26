import {FoveaHost, FoveaHostConstructor} from "@fovea/common";
import {incrementUuid} from "../../uuid/increment-uuid/increment-uuid";
import {IDestroyable} from "../../destroyable/i-destroyable";

/**
 * A noop destroyable for constructed FoveaHosts
 * @type {{destroy: () => void}}
 */
const NOOP_DESTROYABLE = {
	destroy: () => {
	}
};

/**
 * Constructs a new FoveaHost
 * @param {FoveaHost} host
 * @param {Element} hostElement
 * @private
 */
export function construct (host: FoveaHost, hostElement: Element): IDestroyable {
	// Map the host element to the host
	host.___hostElement = hostElement;
	const constructor = <FoveaHostConstructor>host.constructor;

	// Generate and map a Uuid to the host node as well as its' constructor (if needed)
	if (constructor.___uuid == null) constructor.___uuid = incrementUuid();
	host.___uuid = incrementUuid();

	return NOOP_DESTROYABLE;
}