import {ICustomAttribute} from "@fovea/common";
import {connectBase} from "./connect-base";
import {isUpgraded} from "../../host/is-upgraded/is-upgraded";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {setRootForNode} from "../../host/root-for-node/set-root-for-node/set-root-for-node";

/**
 * Runs the logic necessary to connect the provided custom attribute
 * @param {ICustomAttribute} host
 * @private
 */
export function __connectCustomAttribute (host: ICustomAttribute): void {
	if (!isUpgraded(host)) {
		// Map the host to its' ShadowRoot
		setRootForNode(host, getRootForNode(getHostElementForHost(host)));
	}
	connectBase(host);
}