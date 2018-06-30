import {EXPRESSION_QUALIFIER_START} from "../expression-qualifier/expression-qualifier";
import {getMatchingOccurrenceOfClosingQualifier} from "./get-matching-occurrence-of-closing-qualifier";
import {normalizeSplittedExpressions} from "./normalize-splitted-expressions";

/**
 * Splits a string by its expressions
 * @param {string} str
 * @returns {string[]}
 */
export function splitByExpressions (str: string): string[] {
	// Make a copy of the string
	let copy = str;

	// Generate an arrow we can populate
	const splitted: string[] = [];

	// Iterate for as long as the copy has content
	while (copy.length > 0) {
		// Take the index of the first occurrence of the expression qualifier (such as '${')
		const indexOfStart = copy.indexOf(EXPRESSION_QUALIFIER_START);

		// If it has none, simply add the rest of the string to the splitted array
		if (indexOfStart < 0) {
			splitted.push(copy);
			break;
		}

		// Otherwise, work on from there
		else {
			// Add whatever comes before the substitution first
			splitted.push(copy.slice(0, indexOfStart));

			// Now, get the index of where the substitution closes
			const indexOfEnd = getMatchingOccurrenceOfClosingQualifier(copy, indexOfStart + 1);

			// If there is not matching end bracket, provide one and add the remainder of the string
			if (indexOfEnd < 0) {
				splitted.push(copy.slice(indexOfStart) + "}");
				break;
			}

			// Otherwise, push the substitution
			else {
				splitted.push(copy.slice(indexOfStart, indexOfEnd + 1));
			}
			// Slice the copy from the end of the substitution and on-wards
			copy = copy.slice(indexOfEnd + 1);
		}
	}

	// Normalize it and remove empty parts
	return normalizeSplittedExpressions(splitted).filter(part => part.length > 0);
}