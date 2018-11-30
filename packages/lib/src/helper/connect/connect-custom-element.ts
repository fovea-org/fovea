import {Json, ICustomElement} from "@fovea/common";
import {connectBase} from "./connect-base";
import {isUpgraded} from "../../host/is-upgraded/is-upgraded";
import {___addShadowRoot} from "../add-shadow-root/add-shadow-root";

/**
 * Runs the logic necessary to connect the provided custom attribute
 * @param {Json} _host
 * @private
 */
export function ___connectCustomElement (_host: Json): void {
	const host = _host as ICustomElement;
	if (!isUpgraded(host)) {
		// Map the host to its' ShadowRoot
		host.___root = ___addShadowRoot(host);
	}
	connectBase(host);
}