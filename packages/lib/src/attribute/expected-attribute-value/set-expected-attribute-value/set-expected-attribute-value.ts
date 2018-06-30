import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {EXPECTED_ATTRIBUTE_VALUE_MAP} from "../expected-attribute-value-map/expected-attribute-value-map";

/**
 * Sets the expected attribute value for the given host, attribute name and attribute value
 * @param {IFoveaHost|ICustomAttribute} host
 * @param {string} attributeName
 * @param {string|null} attributeValue
 */
export function setExpectedAttributeValue (host: IFoveaHost|ICustomAttribute, attributeName: string, attributeValue: string|null): void {
	let map = EXPECTED_ATTRIBUTE_VALUE_MAP.get(host);
	// If the map doesn't exist, initialize it to a new one
	if (map == null) {
		map = new Map();
		EXPECTED_ATTRIBUTE_VALUE_MAP.set(host, map);
	}

	// Map the attribute name to the given attribute value or remove it if the value is now undefined
	attributeValue == null ? map.delete(attributeName) : map.set(attributeName, attributeValue);
}