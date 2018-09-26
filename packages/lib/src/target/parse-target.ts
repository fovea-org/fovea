import {FoveaHost, REF_QUALIFIER} from "@fovea/common";
import {getRootForNode} from "../host/root-for-node/get-root-for-node/get-root-for-node";

// tslint:disable:no-any

/**
 * Parses an Element target or an EventTarget from the given target which may also be a string
 * @param {FoveaHost} host
 * @param {Element | EventTarget | string} target
 * @returns {Element | EventTarget | null}
 */
export function parseTarget (host: FoveaHost, target: Element|EventTarget|string): Element|EventTarget|null {
	if (typeof target === "string") return parseStringTarget(host, target);
	return target;
}

/**
 * Parses a string target based on a given host
 * @param {FoveaHost} host
 * @param {string} target
 * @returns {Element | EventTarget | null}
 */
export function parseStringTarget (host: FoveaHost, target: string): Element|EventTarget|null {
	const hostElement = host.___hostElement;
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
			if (target.startsWith(REF_QUALIFIER)) return (<any>host)[target];

			// Otherwise attempt to query the target
			const hostQuery = hostElement.querySelector(target);
			if (hostQuery != null) return hostQuery;

			// Finally attempt to query the root
			return root == null ? null : root.querySelector(target);
	}
}