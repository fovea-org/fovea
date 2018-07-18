import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";
import {IMutationObserverBaseOptions} from "@fovea/common";

/**
 * Registers a method as a change callback for when any of the given attribute names change
 * @param {string|string[]} attributes
 * @param {Partial<IMutationObserverBaseOptions>} [options]
 */
export function onAttributeChange<U extends (HTMLElement|typeof HTMLElement|ICustomAttribute|ICustomAttributeConstructor)> (attributes: string[]|string, options?: Partial<IMutationObserverBaseOptions>) {
	return function (target: U, name: string): void {
	};
}