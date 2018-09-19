import {getMatchingOccurrenceOfClosingQualifier} from "@fovea/common";

/**
 * The prefix to add to rewritten scss variables
 * @type {string}
 */
export const SCSS_VARIABLE_REWRITE_PREFIX = "--__REWRITTEN_SCSS_VARIABLE__";

/**
 * The prefix to add to temporary scss variables
 * @type {string}
 */
export const SCSS_TEMPORARY_PREFIX = "__TEMPORARY_SCSS_VARIABLE__";

/**
 * A Regular Expression to match SCSS variables
 * @type {RegExp}
 */
export const scssVariableRegex = /^\$\w+/;

//
/**
 * The prefix for SCSS variables
 * @type {string}
 */
export const scssVariablePrefix = "$";
//
/**
 * The prefix for CSS Custom properties
 * @type {string}
 */
export const cssCustomPropertyPrefix = "--";

/**
 * A Regular Expression to match CSS Custom Properties
 * @type {RegExp}
 */
export const cssCustomPropertyRegex = new RegExp(`^${cssCustomPropertyPrefix}`);

/**
 * A Regular Expression to match SCSS variables and/or CSS custom properties
 * @type {RegExp}
 */
export const customPropertyRegex = /^\$|^--/;

/**
 * A Regular Expression to match references to SCSS variables and/or CSS custom properties
 * @type {RegExp}
 */
export const variableReferenceRegex = /(\$[^{),;\s\t\n]+|var\([^)]*\))/;

/**
 * A Regular Expression to match references to SCSS variables and/or CSS custom properties
 * @type {RegExp}
 */
export const variableReferenceRegexGlobal = /(\$[^{),;\s\t\n]+|var\([^)]*\))/g;

/**
 * A regular expression for matching usage of default values for  CSS Custom properties
 * @type {RegExp}
 */
export const cssCustomPropertyDefaultValueRegex = /^var\(--[^,]*,([^)]*)\)/;

/**
 * Returns true if the given value contains one or more variable references
 * @param {string} value
 * @returns {boolean}
 */
export function containsVariableReference (value: string): boolean {
	return variableReferenceRegex.test(value);
}

/**
 * Replaces all references to variables by the values of those variables
 * @param {string} value
 * @param {object} variables
 * @returns {string}
 */
export function replaceVariableReferences (value: string, variables: {[key: string]: string}): string {
	return `#{'${value
		.replace(variableReferenceRegexGlobal, match => {
			const variableMatch = variables[match];
			if (variableMatch != null) {
				return containsVariableReference(variableMatch) ? replaceVariableReferences(variableMatch, variables) : variableMatch;
			}

			else {
				const replaced = takeDefaultValueForCSSCustomProperty(match);
				if (replaced != null) {
					if (containsVariableReference(replaced)) return replaceVariableReferences(replaced, variables);
					else return replaced;
				} else {
					return match;
				}
			}
		})}'}`;
}

/**
 * Takes the default value for the provided CSS Custom Property
 * @param {string} value
 * @returns {string?}
 */
export function takeDefaultValueForCSSCustomProperty (value: string): string|undefined {
	const match = value.match(cssCustomPropertyDefaultValueRegex);
	if (match == null) return undefined;

	const indexOfStart = value.indexOf("(");
	const defaultValueIndexOfStart = value.indexOf(match[1]);
	if (indexOfStart < 0 || defaultValueIndexOfStart < 0) return undefined;

	const endIndex = getMatchingOccurrenceOfClosingQualifier(value, indexOfStart + 1, "(", ")");
	if (endIndex < 0) return undefined;

	// Replace the property value with the default value for the CSS Custom Property
	return value.slice(defaultValueIndexOfStart, endIndex).trim();
}