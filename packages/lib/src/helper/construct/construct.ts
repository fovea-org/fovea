import {ICustomAttribute, IFoveaHost, isIFoveaHost} from "@fovea/common";
import {incrementUuid} from "../../uuid/increment-uuid/increment-uuid";
import {setHostElementForHost} from "../../host/host-element-for-host/set-host-element-for-host/set-host-element-for-host";
import {setHostForNode} from "../../host/host-for-node/set-host-for-node/set-host-for-node";
import {setUuidForNode} from "../../uuid/uuid-for-node/set-uuid-for-node/set-uuid-for-node";

/**
 * Constructs a new IFoveaHost or ICustomAttribute
 * @param {IFoveaHost|ICustomAttribute} host
 * @param {Element} hostElement
 * @private
 */
export function __construct (host: IFoveaHost|ICustomAttribute, hostElement: Element): void {
	// If it is an IFoveaHost
	if (isIFoveaHost(host)) {
		// Mark the host node as the host itself.
		setHostForNode(host, host);
	}

	// Map the host element to the host
	setHostElementForHost(host, hostElement);

	// Generate and map a Uuid to the host node
	setUuidForNode(host, incrementUuid());
}