import {ExpressionChain, ExpressionChainDict, isExpressionChain} from "@fovea/common";

/**
 * Normalizes the given Custom Attribute Expression value
 * @param {ExpressionChain | ExpressionChainDict} value
 * @returns {ExpressionChainDict}
 */
export function normalizeCustomAttributeExpressionValue (value?: ExpressionChain|ExpressionChainDict): ExpressionChainDict {
	return value == null || isExpressionChain(value) ? {value} : value;
}