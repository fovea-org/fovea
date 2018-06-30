import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {HOST_TO_HOST_ELEMENT_MAP} from "../host-to-host-element-map/host-to-host-element-map";

/**
 * Maps an IFoveaHost to its host element
 * @param {IFoveaHost} host
 * @param {Element} hostElement
 */
export function setHostElementForHost (host: IFoveaHost|ICustomAttribute, hostElement: Element): void {
	HOST_TO_HOST_ELEMENT_MAP.set(host, hostElement);
}