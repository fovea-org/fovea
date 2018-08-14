import {ExpressionChain, isExpression, IType} from "@fovea/common";
import {UpgradedExpressionChain} from "../upgraded-expression-chain/upgraded-expression-chain";

/**
 * Converts an ExpressionChain to an UpgradedExpressionChain
 * @param {ExpressionChain} chain
 * @param {IType} coerceTo
 * @returns {UpgradedExpressionChain}
 */
export function upgradeExpressionChain (chain: ExpressionChain, coerceTo: IType): UpgradedExpressionChain {
	const upgradedChain = <UpgradedExpressionChain> chain;

	// If it has already been upgraded, return it as it is
	if (upgradedChain.isAsync != null) return upgradedChain;

	// Set the 'isAsync' property on the chain
	upgradedChain.isAsync = chain.some(expression => {
		// if it is an expression, return true if it is async.
		if (isExpression(expression)) {
			const [, , isAsync] = expression;
			return isAsync;
		}

		// Otherwise, return false
		return false;
	});
	upgradedChain.coerceTo = coerceTo;
	return upgradedChain;
}