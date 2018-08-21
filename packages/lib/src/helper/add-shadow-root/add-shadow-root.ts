import {IFoveaHost} from "@fovea/common";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";

/**
 * Adds a ShadowRoot to the provided host
 * @param {IFoveaHost} host
 * @returns {ShadowRoot}
 * @private
 */
export function ___addShadowRoot (host: IFoveaHost): ShadowRoot {
	return getHostElementForHost(host)
		.attachShadow({mode: "open"});
}