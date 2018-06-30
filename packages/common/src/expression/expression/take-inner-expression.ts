import {EXPRESSION_QUALIFIER_END, EXPRESSION_QUALIFIER_START} from "../expression-qualifier/expression-qualifier";
import {containsExpression} from "./contains-expression";
import {splitByExpressions} from "./split-by-expressions";

/**
 * Takes the inner contents of an expression and returns it.
 * If none is matched, the original string is returned.
 * @param {string} expression
 * @returns {string}
 */
export function takeInnerExpression (expression: string): string {
	if (!containsExpression(expression)) return expression;
	// Split the provided expression string by its' expressions
	const splitted = splitByExpressions(expression);
	const firstMatchedExpression = splitted.find(splittedExpression => splittedExpression.startsWith(EXPRESSION_QUALIFIER_START))!;
	return firstMatchedExpression.slice(firstMatchedExpression.indexOf(EXPRESSION_QUALIFIER_START) + EXPRESSION_QUALIFIER_START.length, firstMatchedExpression.lastIndexOf(EXPRESSION_QUALIFIER_END));
}