import {ICustomAttribute} from "@fovea/common";
import {isUpgraded} from "../is-upgraded/is-upgraded";
import {getRootForNode} from "../root-for-node/get-root-for-node/get-root-for-node";
import {setRootForNode} from "../root-for-node/set-root-for-node/set-root-for-node";
import {getHostElementForHost} from "../host-element-for-host/get-host-element-for-host/get-host-element-for-host";

/**
 * Upgrades an ICustomAttribute.
 * @param {ICustomAttribute} host
 * @returns {ShadowRoot|Element|undefined}
 */
export function upgradeICustomAttribute (host: ICustomAttribute): ShadowRoot|Element|undefined {
	// If the host has already been upgraded, return immediately.
	if (isUpgraded(host)) return;

	// Get the root for the node
	const root = getRootForNode(getHostElementForHost(host));

	// Map the host to its' ShadowRoot
	setRootForNode(host, root);

	return root;
}