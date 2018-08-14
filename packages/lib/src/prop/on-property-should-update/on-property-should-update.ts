import {Json, Optional} from "@fovea/common";

/**
 * Invoked when a property should change
 * @param {Element} node
 * @param {string} propertyName
 * @param {Optional<T>} newValue
 */
export function onPropertyShouldUpdate<T> (node: Element, propertyName: string, newValue: Optional<T>): void {

	const normalizedKey = <keyof Element> propertyName;
	const oldValue = (<Json>node)[normalizedKey];

// If it didn't change, return immediately
	if (newValue === oldValue) return;

// Set the new value
	(<Json>node)[normalizedKey] = newValue;
}