export const ELEMENT_APPEND_ATTRIBUTE_QUALIFIER_START = "";
export const ELEMENT_APPEND_ATTRIBUTE_QUALIFIER_END = "+";

/**
 * Returns true if the given attribute name is wrapped in the append-attribute qualifiers
 * @param {string} name
 * @returns {boolean}
 */
export function matchesAppendAttributeQualifier (name: string): boolean {
	const trimmed = name.trim();
	return trimmed.startsWith(ELEMENT_APPEND_ATTRIBUTE_QUALIFIER_START) && trimmed.endsWith(ELEMENT_APPEND_ATTRIBUTE_QUALIFIER_END);
}

/**
 * Makes an append attribute normalized (e.g. look like a proper attribute)
 * @param {string} name
 * @returns {boolean}
 */
export function normalizeAppendAttribute (name: string): string {
	if (!matchesAppendAttributeQualifier(name)) return name;
	const trimmed = name.trim();
	return trimmed.slice(ELEMENT_APPEND_ATTRIBUTE_QUALIFIER_START.length, -ELEMENT_APPEND_ATTRIBUTE_QUALIFIER_END.length);
}