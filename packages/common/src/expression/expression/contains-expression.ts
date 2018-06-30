import {Optional} from "../../optional/optional";
import {EXPRESSION_QUALIFIER} from "../expression-qualifier/expression-qualifier";

/**
 * Returns true if the given string contains an expression.
 * @param {Optional<string>} item
 * @returns {boolean}
 */
export function containsExpression (item: Optional<string>): boolean {
	return item != null && EXPRESSION_QUALIFIER.test(item);
}