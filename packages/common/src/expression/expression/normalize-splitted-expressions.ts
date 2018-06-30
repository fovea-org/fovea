import {EXPRESSION_QUALIFIER_END, EXPRESSION_QUALIFIER_START} from "../expression-qualifier/expression-qualifier";
import {isQuoted, unquote} from "@wessberg/stringutil";

/**
 * A regular expression to match a number
 * Matches integers and floats, but not expressions such as 2+2
 * @type {RegExp}
 */
const IS_NUMBER_REGEX = /^(\d+\.*)+$/;

/**
 * Normalizes an array of splitted expressions by converting expressions to primitive
 * values if they actual represent such values (for example, ${2}, ${"foo"} and ${true} is actually primitive values)
 * @param {string[]} splittedExpressions
 * @returns {string[]}
 */
export function normalizeSplittedExpressions (splittedExpressions: string[]): string[] {
	return splittedExpressions.map(part => {
		const inner = (part.startsWith(EXPRESSION_QUALIFIER_START) ? part.slice(EXPRESSION_QUALIFIER_START.length, part.lastIndexOf(EXPRESSION_QUALIFIER_END)) : part).trim();
		const isPrimitive = (
			// Check if it is quoted
			isQuoted(inner) ||
			// Check if it is a number
			IS_NUMBER_REGEX.test(inner) ||
			// Check if it is actually a boolean
			inner === "false" ||
			inner === "true"

		);

		// If it is actually a primitive value, just return the inner contents of it
		if (isPrimitive) {
			return unquote(inner);
		}

		// Otherwise, return the part as it is
		return part;
	});
}