import {ICustomAttribute} from "@fovea/common";
import {connectBase} from "./connect-base";
import {isUpgraded} from "../../host/is-upgraded/is-upgraded";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";

/**
 * Runs the logic necessary to connect the provided custom attribute
 * @param {ICustomAttribute} host
 * @private
 */
export function ___connectCustomAttribute (host: ICustomAttribute): void {
	if (!isUpgraded(host)) {
		// Map the host to its' ShadowRoot
		host.___root = getRootForNode(host.___hostElement);
	}
	connectBase(host);
}