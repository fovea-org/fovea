import {RawExpressionBindable} from "./raw-expression-bindable";

/**
 * Returns true if the given item is a RawExpressionBindable
 * @param {string | RawExpressionBindable} item
 * @returns {boolean}
 */
export function isRawExpressionBindable (item: string|RawExpressionBindable): item is RawExpressionBindable {
	return typeof item !== "string";
}