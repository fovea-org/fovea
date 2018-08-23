import {IFoveaHost} from "@fovea/common";
import {connectBase} from "./connect-base";
import {isUpgraded} from "../../host/is-upgraded/is-upgraded";
import {___addShadowRoot} from "../add-shadow-root/add-shadow-root";
import {setRootForNode} from "../../host/root-for-node/set-root-for-node/set-root-for-node";

/**
 * Runs the logic necessary to connect the provided custom attribute
 * @param {IFoveaHost} host
 * @private
 */
export function ___connectFoveaHost (host: IFoveaHost): void {
	if (!isUpgraded(host)) {
		// Map the host to its' ShadowRoot
		setRootForNode(host, ___addShadowRoot(host));
	}
	connectBase(host);
}