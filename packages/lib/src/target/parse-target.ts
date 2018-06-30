import {ICustomAttribute, IFoveaHost, Json, REF_QUALIFIER} from "@fovea/common";
import {getHostElementForHost} from "../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {getRootForNode} from "../host/root-for-node/get-root-for-node/get-root-for-node";

/**
 * Parses an Element target or an EventTarget from the given target which may also be a string
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {Element | EventTarget | string} target
 * @returns {Element | EventTarget | null}
 */
export function parseTarget (host: IFoveaHost|ICustomAttribute, target: Element|EventTarget|string): Element|EventTarget|null {
	if (typeof target === "string") return parseStringTarget(host, target);
	return target;
}

/**
 * Parses a string target based on a given host
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {string} target
 * @returns {Element | EventTarget | null}
 */
export function parseStringTarget (host: IFoveaHost|ICustomAttribute, target: string): Element|EventTarget|null {
	const hostElement = getHostElementForHost(host);
	const root = getRootForNode(hostElement);
	const selector = hostElement.tagName.toLowerCase();

	switch (target) {
		case "root":
		case "shadowRoot":
			return root;

		case "this":
		case "self":
		case selector:
			return hostElement;

		case "window":
		case "global":
			return window;

		case "body":
			return document.body;

		default:
			// Check if the target starts with the REF qualifier
			if (target.startsWith(REF_QUALIFIER)) return (<Json>host)[target];

			// Otherwise attempt to query the target
			const hostQuery = hostElement.querySelector(target);
			if (hostQuery != null) return hostQuery;

			// Finally attempt to query the root
			return root == null ? null : root.querySelector(target);
	}
}