import {ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";

/**
 * Provides one or more paths to read templates from for a Fovea component
 * @template T
 * @param {string|string[]} src
 * @returns {(target: T) => void}
 */
export function templateSrc (src: string|string[]) {
	return function <T extends typeof HTMLElement|ICustomAttributeConstructor> (target: T): void {};
}