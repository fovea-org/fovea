import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";
import {IHostListenerBaseOptions} from "@fovea/common";

/**
 * Registers a method as an event listener for the given event(s) and option(s)
 * @param {string|string[]} events
 * @param {Partial<IHostListenerBaseOptions>} [options]
 * @returns {Function}
 */
export function listener (events: string|string[], options?: Partial<IHostListenerBaseOptions>) {
	return function <T extends (HTMLElement|typeof HTMLElement|ICustomAttribute|ICustomAttributeConstructor)> (target: T, name: string): void {
	};
}