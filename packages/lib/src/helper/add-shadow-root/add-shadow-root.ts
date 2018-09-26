import {ICustomElement} from "@fovea/common";

/**
 * Adds a ShadowRoot to the provided host
 * @param {ICustomElement} host
 * @returns {ShadowRoot}
 * @private
 */
export function ___addShadowRoot (host: ICustomElement): ShadowRoot {
	return host.___hostElement
		.attachShadow({mode: "open"});
}