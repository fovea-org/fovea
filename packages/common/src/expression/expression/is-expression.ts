import {Expression} from "./expression";

/**
 * Returns true if the given item is a Expression
 * @param {string | Expression} item
 * @returns {boolean}
 */
export function isExpression (item: string|Expression): item is Expression {
	return typeof item !== "string";
}