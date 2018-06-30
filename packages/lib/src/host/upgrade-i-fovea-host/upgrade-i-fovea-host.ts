import {IFoveaHost} from "@fovea/common";
import {__addShadowRoot} from "../../helper/add-shadow-root/add-shadow-root";
import {setRootForNode} from "../root-for-node/set-root-for-node/set-root-for-node";
import {isUpgraded} from "../is-upgraded/is-upgraded";

/*# IF hasIFoveaHosts */

/**
 * Upgrades an IFoveaHost. It attaches a ShadowRoot to it and constructs its root nodes.
 * @param {IFoveaHost} host
 * @returns {ShadowRoot|Element}
 */
export function upgradeIFoveaHost (host: IFoveaHost): ShadowRoot|Element|undefined {
	// If the host has already been upgraded, return immediately.
	if (isUpgraded(host)) return;

	// Attach a ShadowRoot
	const root = __addShadowRoot(host);

	// Map the host to its' ShadowRoot
	setRootForNode(host, root);

	return root;
} /*# END IF hasIFoveaHosts */