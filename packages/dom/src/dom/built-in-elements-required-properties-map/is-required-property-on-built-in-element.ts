import {BUILT_IN_ELEMENTS_REQUIRED_PROPERTIES_MAP} from "./built-in-elements-required-properties-map";

/**
 * Returns true if the given property must be set as a property (rather than as an attribute) on the elements of the given type
 * @param {string} elementName
 * @param {string} property
 * @returns {boolean}
 */
export function isRequiredPropertyOnBuiltInElement (elementName: string, property: string): boolean {
	if (!BUILT_IN_ELEMENTS_REQUIRED_PROPERTIES_MAP.has(elementName)) return false;
	return BUILT_IN_ELEMENTS_REQUIRED_PROPERTIES_MAP.get(elementName)!.has(property);
}