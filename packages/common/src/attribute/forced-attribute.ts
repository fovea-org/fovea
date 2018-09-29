export const ELEMENT_FORCED_ATTRIBUTE_QUALIFIER_START = "[";
export const ELEMENT_FORCED_ATTRIBUTE_QUALIFIER_END = "]";

/**
 * Returns true if the given attribute name is wrapped in the forced attribute qualifiers
 * @param {string} name
 * @returns {boolean}
 */
export function matchesForcedAttributeQualifier (name: string): boolean {
	const trimmed = name.trim();
	return trimmed.startsWith(ELEMENT_FORCED_ATTRIBUTE_QUALIFIER_START) && trimmed.endsWith(ELEMENT_FORCED_ATTRIBUTE_QUALIFIER_END);
}

/**
 * Makes a forced attribute normalized (e.g. look like a proper attribute)
 * @param {string} name
 * @returns {boolean}
 */
export function normalizeForcedAttribute (name: string): string {
	if (!matchesForcedAttributeQualifier(name)) return name;
	const trimmed = name.trim();
	return trimmed.slice(ELEMENT_FORCED_ATTRIBUTE_QUALIFIER_START.length, -ELEMENT_FORCED_ATTRIBUTE_QUALIFIER_END.length);
}