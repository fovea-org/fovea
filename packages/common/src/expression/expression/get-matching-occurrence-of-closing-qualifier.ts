import {EXPRESSION_QUALIFIER_BRACKET_START, EXPRESSION_QUALIFIER_END} from "../expression-qualifier/expression-qualifier";

/**
 * Gets the matching index position of the closing qualifier for an expression
 * @param {string} str
 * @param {number} from
 * @returns {number}
 */
export function getMatchingOccurrenceOfClosingQualifier (str: string, from: number): number {
	let toIgnore = 0;
	let closingIndex = -1;

	for (let i = from + 1; i < str.length; i++) {
		if (str[i] === EXPRESSION_QUALIFIER_END) {
			if (toIgnore === 0) {
				closingIndex = i;
				break;
			} else {
				toIgnore -= 1;
			}
		}

		else if (str[i] === EXPRESSION_QUALIFIER_BRACKET_START) {
			toIgnore += 1;
		}
	}
	return closingIndex;
}