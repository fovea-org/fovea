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
 * A Regular Expression to match references to SCSS variables
 * @type {RegExp}
 */
export const scssVariableReferenceRegex = /(\$[^{}),;\s\t\n]+)/;

/**
 * A regular expression for matching usage of default values for  CSS Custom properties
 * @type {RegExp}
 */
export const cssCustomPropertyReferenceRegex = /(var\(--[^,)]*)(,)?([^)]*)?\)/;

/**
 * A Regular Expression to match references to SCSS variables and/or CSS custom properties
 * @type {RegExp}
 */
export const variableReferenceRegexGlobal = /(\$[^{),;\s\t\n]+|var\([^)]*\))/g;

/**
 * Returns true if the given value contains one or more variable references
 * @param {string} value
 * @returns {boolean}
 */
export function containsVariableReference (value: string): boolean {
	return containsScssVariableReference(value) || containsCSSCustomPropertyReference(value);
}

/**
 * Returns true if the given value contains one or more SCSS variable references
 * @param {string} value
 * @returns {boolean}
 */
export function containsScssVariableReference (value: string): boolean {
	return scssVariableReferenceRegex.test(value);
}

/**
 * Returns true if the given value contains one or more CSS Custom property references
 * @param {string} value
 * @returns {boolean}
 */
export function containsCSSCustomPropertyReference (value: string): boolean {
	return cssCustomPropertyReferenceRegex.test(value);
}

/**
 * Takes all references to CSS Custom Properties
 * @param {string} value
 * @param {string[]} references
 * @returns {string[]}
 */
function takeAllCSSCustomPropertyReferences (value: string, references: string[] = []): string[] {
	const match = value.match(cssCustomPropertyReferenceRegex);
	if (match == null) return references;

	const startIndex = match.index!;
	const endIndex = getMatchingOccurrenceOfClosingQualifier(value, startIndex + value.indexOf("(") + 1, "(", ")");
	if (endIndex >= 0) {
		references.push(value.slice(startIndex, endIndex + 1));
		return takeAllCSSCustomPropertyReferences(value.slice(endIndex + 1), references);
	}
	return references;
}

/**
 * Takes all references to SCSS variables
 * @param {string} value
 * @param {string[]} references
 * @returns {string[]}
 */
function takeAllSCSSVariableReferences (value: string, references: string[] = []): string[] {
	const match = value.match(scssVariableReferenceRegex);
	if (match == null) return references;
	const relevantMatch = match[1];
	references.push(relevantMatch);
	return takeAllSCSSVariableReferences(value.slice(match.index! + relevantMatch.length), references);
}

/**
 * Replaces all references to variables by the values of those variables
 * @param {string} prop
 * @param {string} value
 * @param {object} variables
 * @param {Set<string>} unknownVariableNames
 * @returns {string}
 */
function replaceVariableReferencesRecursiveStep (prop: string, value: string, variables: { [key: string]: string }, unknownVariableNames: Set<string> = new Set()): string {
	let currentValue = value;
	const allReferences = [...takeAllCSSCustomPropertyReferences(currentValue), ...takeAllSCSSVariableReferences(currentValue)];

	// If there are no more variable references, or if all of them are unknown return the value as-is
	if (allReferences.length === 0 || allReferences.every(reference => unknownVariableNames.has(takeFirstVariableReferenceName(reference)))) {
		return currentValue;
	}

	allReferences.forEach(reference => {
		// Take the variable name. For example, for: 'var(--foo, <default-value>)', 'var(--foo)' will be returned
		const firstVariableName = takeFirstVariableReferenceName(reference);

		// Check if it exists within the variables
		const variableValueForFirstVariableName = variables[firstVariableName];

		// Check if it is a self-reference
		const propRef = isScssVariable(prop) ? prop : `var(${prop})`;
		const isCircularReference = firstVariableName === propRef || (variableValueForFirstVariableName != null && variableValueForFirstVariableName.includes(propRef));

		// If a value is already computed for the variable, and it isn't a circular reference, replace the value with the one from the variables
		if (!isCircularReference && variableValueForFirstVariableName != null) {
			currentValue = currentValue.replace(reference, variableValueForFirstVariableName);
		}

		// Otherwise, replace the value by its' default/initializer value - if it has any
		else {
			const defaultValue = isScssVariable(reference) ? null : takeDefaultValueForCSSCustomProperty(reference);
			if (defaultValue != null) {
				currentValue = currentValue.replace(reference, defaultValue);
			}

			else {
				unknownVariableNames.add(firstVariableName);
			}
		}
	});

	// Perform this work recursively
	return replaceVariableReferencesRecursiveStep(prop, currentValue, variables, unknownVariableNames);
}

/**
 * Replaces all references to variables by the values of those variables
 * @param {string} prop
 * @param {string} value
 * @param {object} variables
 * @returns {string}
 */
export function replaceVariableReferences (prop: string, value: string, variables: { [key: string]: string }): string {
	return `#{'${replaceVariableReferencesRecursiveStep(prop, value, variables)}'}`;
}

/**
 * Takes the name for a CSS Custom Property reference.
 * If it has a default value, it will be discarded
 * @param {string} value
 * @returns {string?}
 */
export function takeFirstVariableReferenceName (value: string): string {
	if (containsScssVariableReference(value)) {
		const scssMatch = value.match(scssVariableReferenceRegex);
		if (scssMatch == null) throw new ReferenceError("Could not take the reference name for the first variable!");
		return scssMatch[1];
	}

	else {
		const match = value.match(cssCustomPropertyReferenceRegex);
		if (match == null) throw new ReferenceError("Could not take the reference name for the first variable!");

		const relevantMatch = match[1];
		return `${relevantMatch})`;
	}
}

/**
 * Takes the default value for the provided CSS Custom Property
 * @param {string} value
 * @returns {string?}
 */
export function takeDefaultValueForCSSCustomProperty (value: string): string|undefined {
	const match = value.match(cssCustomPropertyReferenceRegex);
	if (match == null) return undefined;

	const relevantMatch = match[3];
	if (relevantMatch == null || relevantMatch.length < 1) return undefined;

	const indexOfStart = 0;
	const defaultValueIndexOfStart = value.indexOf(relevantMatch);
	if (indexOfStart < 0 || defaultValueIndexOfStart < 0) return undefined;

	const endIndex = getMatchingOccurrenceOfClosingQualifier(value, indexOfStart + value.indexOf("(") + 1, "(", ")");
	if (endIndex < 0) return undefined;

	// Replace the property value with the default value for the CSS Custom Property
	return value.slice(defaultValueIndexOfStart, endIndex).trim();
}

/**
 * Returns true if the given property is a SCSS variable declaration
 * @param {string} property
 * @returns {boolean}
 */
export function isScssVariable (property: string): boolean {
	return scssVariableRegex.test(property);
}

/**
 * Returns true if the given property is a variable declaration
 * @param {string} property
 * @returns {boolean}
 */
export function isCustomProperty (property: string): boolean {
	return customPropertyRegex.test(property);
}

/**
 * Escapes the given value
 * @param {string} value
 * @returns {string}
 */
export function escapeValue (value: string): string {
	return `#{${value}}`;
}

/**
 * Returns true if the given property is a CSS Custom property
 * @param {string} property
 * @returns {boolean}
 */
export function isCSSCustomProperty (property: string): boolean {
	return cssCustomPropertyRegex.test(property);
}