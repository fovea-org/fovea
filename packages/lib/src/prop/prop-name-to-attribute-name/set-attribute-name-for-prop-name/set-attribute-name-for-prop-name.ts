import {IProp} from "@fovea/common";
import {PROP_NAME_TO_ATTRIBUTE_NAME_MAP} from "../prop-name-to-attribute-name-map/prop-name-to-attribute-name-map";
import {ATTRIBUTE_NAME_TO_PROP_NAME_MAP} from "../attribute-name-to-prop-name-map/attribute-name-to-prop-name-map";

/**
 * Maps a prop name to an attribute name
 * @param {string | IProp} prop
 * @param {string} attribute
 */
export function setAttributeNameForPropName (prop: string|IProp, attribute: string): void {
	const propName = typeof prop === "string" ? prop : prop.name;

	// Map the prop name to the attribute name
	PROP_NAME_TO_ATTRIBUTE_NAME_MAP.set(propName, attribute);

	// Map the attribute name to the prop name
	ATTRIBUTE_NAME_TO_PROP_NAME_MAP.set(attribute, propName);
}