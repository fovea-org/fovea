import {ICustomAttribute, IFoveaHost, isIFoveaHost} from "@fovea/common";
import {incrementUuid} from "../../uuid/increment-uuid/increment-uuid";
import {setHostElementForHost} from "../../host/host-element-for-host/set-host-element-for-host/set-host-element-for-host";
import {setHostForNode} from "../../host/host-for-node/set-host-for-node/set-host-for-node";
import {setUuidForNode} from "../../uuid/uuid-for-node/set-uuid-for-node/set-uuid-for-node";
import {upgradeCustomAttribute} from "../../custom-attribute/upgrade-custom-attribute";
import {CONSTRUCTED_HOSTS} from "../../host/constructed-hosts/constructed-hosts";
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

	let upgradedCustomAttribute: IDestroyable|null = !isIFoveaHost(host) ? upgradeCustomAttribute(host, hostElement) : null;

	// Make sure that it can be disposed later on
	CONSTRUCTED_HOSTS.add(host, {
		destroy: () => {
			if (upgradedCustomAttribute != null) {
				upgradedCustomAttribute.destroy();
				upgradedCustomAttribute = null;
			}
			removeUuidForNode(host);
			removeHostElementForHost(host);
			if (isIFoveaHost(host)) {
				removeHostForNode(host);
			}
		}
	});
}