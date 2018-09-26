import {FoveaHost} from "@fovea/common";
import {EXPECTED_ATTRIBUTE_VALUE_MAP} from "../expected-attribute-value-map/expected-attribute-value-map";

/**
 * Gets the expected attribute value for the given host and attribute name
 * @param {FoveaHost} host
 * @param {string} attributeName
 * @returns {string | null}
 */
export function getExpectedAttributeValue (host: FoveaHost, attributeName: string): string|null {
	const expectedAttributeMap = EXPECTED_ATTRIBUTE_VALUE_MAP.get(host);
	// If the map doesn't exist, return undefined
	if (expectedAttributeMap == null) {
		return null;
	}

	// Return the expected attribute value
	const attributeValue = expectedAttributeMap.get(attributeName);
	return attributeValue == null ? null : attributeValue;
}