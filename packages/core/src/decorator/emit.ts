import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";
import {IEmitBaseOptions} from "@fovea/common";

/**
 * Registers a prop as an event emitter for an IFoveaHost or ICustomAttribute.
 * @param {Partial<IEmitBaseOptions>} options
 * @returns {Function}
 */
export function emit (options?: Partial<IEmitBaseOptions>) {
	return function <T extends (HTMLElement|typeof HTMLElement|ICustomAttribute|ICustomAttributeConstructor)> (target: T, name: string): void {};
}