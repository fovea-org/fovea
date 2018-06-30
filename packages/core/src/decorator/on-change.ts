import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";

/**
 * Registers a method as a change callback for when any of the given props change
 * @param {string|string[]} props
 * @param {boolean} [whenAllAreInitialized=false]
 */
export function onChange<U extends (HTMLElement|typeof HTMLElement|ICustomAttribute|ICustomAttributeConstructor)> (props: string[]|string, whenAllAreInitialized: boolean = false) {
	return function (target: U, name: string): void {
	};
}