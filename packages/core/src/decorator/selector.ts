import {ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";

/**
 * Provides a specific selector to use when defining and referencing a Fovea component inside the DOM
 * @template T
 * @param {string} name
 * @returns {(target: T) => void}
 */
export function selector (name: string) {
	return function <T extends typeof HTMLElement|ICustomAttributeConstructor> (target: T): void {};
}