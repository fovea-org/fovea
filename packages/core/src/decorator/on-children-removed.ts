import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";
import {IMutationObserverBaseOptions} from "@fovea/common";

/**
 * Marks a MethodDeclaration as a callback for when the host element or a given target loses children
 * @param {Partial<IMutationObserverBaseOptions>} [options]
 * @returns {Function}
 */
export function onChildrenRemoved (options?: Partial<IMutationObserverBaseOptions>) {
	return function <T extends (HTMLElement|typeof HTMLElement|ICustomAttribute|ICustomAttributeConstructor)> (target: T, name: string): void {
	};
}