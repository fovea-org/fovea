import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {HOST_TO_HOST_ELEMENT_MAP} from "../host-to-host-element-map/host-to-host-element-map";

/**
 * Removes a host from the map
 * @param {IFoveaHost} host
 */
export function removeHostElementForHost (host: IFoveaHost|ICustomAttribute): void {
	HOST_TO_HOST_ELEMENT_MAP.delete(host);
}