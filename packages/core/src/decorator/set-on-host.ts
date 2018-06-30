import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";

/**
 * Marks a PropertyDeclaration as one that should be set on the host element
 * @param {T} target
 * @param {string} name
 */
export function setOnHost<T extends (HTMLElement|typeof HTMLElement|ICustomAttribute|ICustomAttributeConstructor)> (target: T, name: string): void {
}