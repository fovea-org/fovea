import {ExpressionChain, IFoveaHost, isExpression} from "@fovea/common";

/**
 * Flattens the provided ExpressionChain
 * @param {ExpressionChain} chain
 * * @param {IFoveaHost} host
 * @returns {string}
 */
export function flattenExpressionChain (chain: ExpressionChain|undefined, host?: IFoveaHost): string {
	return chain == null ? "" : chain.map(part => isExpression(part) ? host == null ? "" : part[0](host) : part).join("");
}