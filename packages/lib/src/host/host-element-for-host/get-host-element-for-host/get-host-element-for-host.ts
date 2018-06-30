import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {HOST_TO_HOST_ELEMENT_MAP} from "../host-to-host-element-map/host-to-host-element-map";

/**
 * Gets the host element for an IFoveaHost
 * @param {IFoveaHost|ICustomAttribute} host
 * @returns {Element}
 */
export function getHostElementForHost (host: IFoveaHost|ICustomAttribute): Element {
	const hostElement = HOST_TO_HOST_ELEMENT_MAP.get(host);
	if (hostElement == null) {
		throw new ReferenceError(`Internal Error: Could not detect a host element for the given host!`);
	}
	return hostElement;
}