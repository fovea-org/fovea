import {FoveaHostConstructor, IMutationObserverBaseOptions} from "@fovea/common";
import {addAttributeChangeObserversForHost} from "../../dom-mutation/attribute-change-observers-for-host/add-attribute-change-observers-for-host";

/**
 * Registers a method to be invoked when any of the provided attributes change
 * @param {FoveaHostConstructor} host
 * @param {string} method
 * @param {boolean} isStatic
 * @param {string | string[]} attributes
 * @param {Partial<IMutationObserverBaseOptions>} options
 * @private
 */
export function ___registerAttributeChangeObserver (host: FoveaHostConstructor, method: string, isStatic: boolean, attributes: string|string[], options?: Partial<IMutationObserverBaseOptions>): void {
	const attributeNames: string[] = Array.isArray(attributes) ? attributes : [attributes];
	const target = options == null || options.target == null ? undefined : options.target;

	// Add the AttributeChangeObserver
	addAttributeChangeObserversForHost(host, {attributes: attributeNames, target, method: {name: method, isStatic}});
}