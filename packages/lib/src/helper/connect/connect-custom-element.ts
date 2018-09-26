import {ICustomElement} from "@fovea/common";
import {connectBase} from "./connect-base";
import {isUpgraded} from "../../host/is-upgraded/is-upgraded";
import {___addShadowRoot} from "../add-shadow-root/add-shadow-root";

/**
 * Runs the logic necessary to connect the provided custom attribute
 * @param {ICustomElement} host
 * @private
 */
export function ___connectCustomElement (host: ICustomElement): void {
	if (!isUpgraded(host)) {
		// Map the host to its' ShadowRoot
		host.___root = ___addShadowRoot(host);
	}
	connectBase(host);
}