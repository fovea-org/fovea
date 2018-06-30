import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {IHostListenerOptions} from "../host-listener-options/i-host-listener-options";
import {HOST_LISTENERS_FOR_HOST} from "./host-listeners-for-host";

/*# IF hasHostListeners */

/**
 * Maps the given host listener(s) to the host, indicating that they should be fired when a prop on the host changes
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @param {Partial<IHostListenerOptions> | Partial<IHostListenerOptions>[]} hostListener
 */
export function addHostListenersForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor, hostListener: Partial<IHostListenerOptions>[]|Partial<IHostListenerOptions>): void {
	// Add the hostListener(s) to the array of host listeners for the host
	HOST_LISTENERS_FOR_HOST.add(host, ...(Array.isArray(hostListener) ? hostListener : [hostListener]));
} /*# END IF hasHostListeners */