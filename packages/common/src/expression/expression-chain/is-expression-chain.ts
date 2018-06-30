import {ExpressionChain} from "./expression-chain";
import {Expression} from "../expression/expression";

/**
 * Returns true if the given item is a ExpressionChain
 * @param {string | Expression | ExpressionChain} item
 * @returns {boolean}
 */
export function isExpressionChain (item: string|Expression|ExpressionChain): item is ExpressionChain {
	if (typeof item === "string") return false;
	return !(item.length === 3 && (typeof item[0] !== "string" && typeof item[1] !== "string" && typeof item[2] !== "boolean"));

}