import {ExpressionChain} from "@fovea/common";
import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";

/*# IF hasTemplateCustomAttributes */

/**
 * Normalizes the given Custom Attribute Expression value
 * @param {ExpressionChain | IExpressionChainDict} value
 * @returns {IExpressionChainDict}
 */
export function normalizeCustomAttributeExpressionValue (value?: ExpressionChain|IExpressionChainDict): IExpressionChainDict {
	return (value == null || Array.isArray(value)) ? {value} : value;
} /*# END IF hasTemplateCustomAttributes */