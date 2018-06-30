import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";

/**
 * Marks a PropertyDeclaration as a prop.
 * @param {T} target
 * @param {string} name
 */
export function prop<T extends (HTMLElement|typeof HTMLElement|ICustomAttribute|ICustomAttributeConstructor)> (target: T, name: string): void {
}