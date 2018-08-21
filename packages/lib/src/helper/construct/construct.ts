import {ICustomAttribute, IFoveaHost, isIFoveaHost} from "@fovea/common";
import {incrementUuid} from "../../uuid/increment-uuid/increment-uuid";
import {setHostElementForHost} from "../../host/host-element-for-host/set-host-element-for-host/set-host-element-for-host";
import {setUuidForNode} from "../../uuid/uuid-for-node/set-uuid-for-node/set-uuid-for-node";
import {removeUuidForNode} from "../../uuid/uuid-for-node/remove-uuid-for-node/remove-uuid-for-node";
import {removeHostElementForHost} from "../../host/host-element-for-host/remove-host-element-for-host/remove-host-element-for-host";
import {removeHostForNode} from "../../host/host-for-node/remove-host-for-node/remove-host-for-node";
import {IDestroyable} from "../../destroyable/i-destroyable";

/**
 * Constructs a new IFoveaHost or ICustomAttribute
 * @param {IFoveaHost|ICustomAttribute} host
 * @param {Element} hostElement
 * @private
 */
export function construct (host: IFoveaHost|ICustomAttribute, hostElement: Element): IDestroyable {

	// Map the host element to the host
	setHostElementForHost(host, hostElement);

	// Generate and map a Uuid to the host node
	setUuidForNode(host, incrementUuid());

	// Make sure that it can be disposed later on
	return {
		destroy: () => {
			removeUuidForNode(host);
			removeHostElementForHost(host);
			if (isIFoveaHost(host)) {
				removeHostForNode(host);
			}
		}
	};
}