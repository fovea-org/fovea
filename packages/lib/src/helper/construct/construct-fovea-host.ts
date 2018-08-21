import {CONSTRUCTED_HOSTS} from "../../host/constructed-hosts/constructed-hosts";
import {construct} from "./construct";
import {IFoveaHost} from "../../../../common/src/fovea-host/i-fovea-host";
import {setHostForNode} from "../../host/host-for-node/set-host-for-node/set-host-for-node";

/**
 * Constructs a new IFoveaHost
 * @param {IFoveaHost} host
 * @param {Element} [hostElement]
 * @private
 */
export function ___constructFoveaHost (host: IFoveaHost, hostElement: Element = host): void {
	// Mark the host node as the host itself.
	setHostForNode(host, host);

	// Invoke the common construct functionality
	CONSTRUCTED_HOSTS.add(host, construct(host, hostElement));
}