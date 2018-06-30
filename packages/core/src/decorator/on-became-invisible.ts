import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";
import {IVisibilityObserverBaseOptions} from "@fovea/common";

/**
 * Marks a MethodDeclaration as a callback for when the host element becomes invisible.
 * @param {Partial<IVisibilityObserverBaseOptions>} [options]
 * @returns {Function}
 */
export function onBecameInvisible (options?: Partial<IVisibilityObserverBaseOptions>) {
	return function <T extends (HTMLElement|typeof HTMLElement|ICustomAttribute|ICustomAttributeConstructor)> (target: T, name: string): void {
	};
}