import {IType, Json} from "@fovea/common";
import {EvaluateExpressionChainResult} from "./i-evaluate-expression-chain-result";
import {coerceValue} from "../coercion/coerce-value";

/**
 * Given an array of evaluated results, it will will cache the evaluated values and return the new- and old values
 * @param {Json[]} results
 * @param {IType} type
 * @returns {EvaluateExpressionChainResult}
 */
export function evaluateExpressionChainCommon (results: Json[], type: IType): EvaluateExpressionChainResult {

	// If there are none, the new value will be undefined
	if (results.length < 1) {
		return coerceValue(undefined, type);
	}

	// If there is only 1, return it.
	else if (results.length === 1) {
		return coerceValue(results[0], type);
	}

	// Otherwise, flatten it to string and coerce it
	else {
		return coerceValue(results.map(value => value == null ? "" : value.toString()).join(""), type);
	}
}