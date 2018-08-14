import {ITemplateProperty} from "../../template/template-property/i-template-property";
import {ICustomAttribute, Json, Optional} from "@fovea/common";

/**
 * Invoked when an attribute should change
 * @param {ICustomAttribute} customAttribute
 * @param {ITemplateProperty} property
 * @param {Optional<Json>} newValue
 */
export function onCustomAttributeValueShouldUpdate<T> (customAttribute: ICustomAttribute, property: ITemplateProperty, newValue: Optional<T>): void {
	const normalizedKey = property.key;
	const oldValue = (<Json>customAttribute)[normalizedKey];

	// If it didn't change, return immediately
	if (newValue === oldValue) return;

	// Set the new value
	(<Json>customAttribute)[normalizedKey] = newValue;
}