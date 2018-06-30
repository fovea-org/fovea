import {ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";

/**
 * Marks a class as a Custom Attribute
 * @param {T} target
 * @returns {void}
 */
export function customAttribute<T extends ICustomAttributeConstructor> (target: T): void {
}