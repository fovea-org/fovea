import {IFoveaHostConstructor} from "@fovea/common";

/**
 * Registers an element
 * @param {string} selector
 * @param {IFoveaHostConstructor} host
 * @private
 */
export function ___registerElement (selector: string, host: IFoveaHostConstructor): void {
	customElements.define(selector, host);
}