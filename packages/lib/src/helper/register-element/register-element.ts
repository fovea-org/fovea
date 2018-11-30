import {ICustomElementConstructor, Json} from "@fovea/common";
import {log} from "../../log/log";

/**
 * Registers an element
 * @param {string} selector
 * @param {Json} _host
 * @private
 */
export function ___registerElement (selector: string, _host: Json): void {
	const host = _host as ICustomElementConstructor;
	try {
		customElements.define(selector, host);
	} catch (ex) {
		log(`The host '${host.name}' attempts to declare a Custom Element with the selector: '${selector}', but an error occurred:`, ex);
	}
}