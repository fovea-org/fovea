import {ICustomElementConstructor} from "@fovea/common";
import {log} from "../../log/log";

/**
 * Registers an element
 * @param {string} selector
 * @param {ICustomElementConstructor} host
 * @private
 */
export function ___registerElement (selector: string, host: ICustomElementConstructor): void {
	try {
		customElements.define(selector, host);
	} catch (ex) {
		log(`The host '${host.name}' attempts to declare a Custom Element with the selector: '${selector}', but an error occurred:`, ex);
	}
}