import {ATTRIBUTE_NAME_TO_PROP_NAME_MAP} from "../attribute-name-to-prop-name-map/attribute-name-to-prop-name-map";

/**
 * Gets the matching prop name name for an attribute name
 * @param {string} attribute
 * @returns {string}
 */
export function getPropNameForAttributeName (attribute: string): string|undefined {

	// Take the prop name from the Map
	const prop = ATTRIBUTE_NAME_TO_PROP_NAME_MAP.get(attribute);

	// Make sure that it is defined
	if (prop == null) {
		return undefined;
	}
	// Return the prop name
	return prop;
}