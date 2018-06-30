import {RawExpressionChainBindable} from "../../expression/raw-expression-chain-bindable/raw-expression-chain-bindable";
import {IRawExpressionChainBindableDict} from "../../expression/i-raw-expression-chain-bindable-dict/i-raw-expression-chain-bindable-dict";

/**
 * Returns true if a given value is empty
 * @param {RawExpressionChainBindable} value
 * @returns {boolean}
 */
export function valueIsEmpty (value: RawExpressionChainBindable|IRawExpressionChainBindableDict): boolean {
	// If it is a dict, it cannot be empty
	if (!Array.isArray(value)) return false;

	if (value == null || value.length === 0) return true;
	return value.some(part => {
		// If it is a string, verify that it isn't empty
		if (typeof part === "string") {
			return part === "";
		}
		// Otherwise, verify that the compute() function isn't empty
		else {
			return false;
		}
	});
}