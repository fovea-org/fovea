import {IProp} from "@fovea/common";
import {PROP_NAME_TO_ATTRIBUTE_NAME_MAP} from "../prop-name-to-attribute-name-map/prop-name-to-attribute-name-map";

/**
 * Gets the matching attribute name for a prop
 * @param {string | IProp} prop
 * @returns {string}
 */
export function getAttributeNameForPropName (prop: string|IProp): string {
	const propName = typeof prop === "string" ? prop : prop.name;

	// Take the attribute name from the Map
	const attribute = PROP_NAME_TO_ATTRIBUTE_NAME_MAP.get(propName);

	// Make sure that it is defined
	if (attribute == null) {
		throw new ReferenceError(`Internal Error: Could not find a matching attribute name for the given prop with name: ${propName}`);
	}
	// Return the attribute name
	return attribute;
}