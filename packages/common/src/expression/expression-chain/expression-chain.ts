import {Expression} from "../expression/expression";
import {isExpression} from "../expression/is-expression";
import {Optional} from "../../optional/optional";

// tslint:disable:interface-name

export declare type ExpressionOrString = string|Expression;
export declare type SyncExpressionChain = ExpressionOrString[];
export declare type AsyncExpressionChain = [true, ExpressionOrString[]];
export declare type ExpressionChain = string|SyncExpressionChain|AsyncExpressionChain;
export declare type NullableExpressionChain = Optional<ExpressionChain>;

export interface ExpressionChainDict {
	[key: string]: ExpressionChain|undefined;
}

/**
 * Returns true if the given ExpressionChain is a pure string
 * @param {NullableExpressionChain} expressionChain
 * @returns {expressionChain is string}
 */
export function isPureStringExpressionChain (expressionChain: NullableExpressionChain): expressionChain is string {
	return typeof expressionChain === "string";
}

/**
 * Returns true if the given ExpressionChain is asynchronous
 * @param {NullableExpressionChain} expressionChain
 * @returns {expressionChain is AsyncExpressionChain}
 */
export function isAsyncExpressionChain (expressionChain: NullableExpressionChain): expressionChain is AsyncExpressionChain {
	return !isPureStringExpressionChain(expressionChain) && expressionChain != null && expressionChain[0] === true;
}

/**
 * Returns true if the given ExpressionChain is synchronous
 * @param {NullableExpressionChain} expressionChain
 * @returns {expressionChain is SyncExpressionChain}
 */
export function isSyncExpressionChain (expressionChain: NullableExpressionChain): expressionChain is SyncExpressionChain {
	return !isPureStringExpressionChain(expressionChain) && expressionChain != null && expressionChain[0] !== true;
}

/**
 * Returns true if the given ExpressionChain is a string or synchronous
 * @param {NullableExpressionChain} expressionChain
 * @returns {expressionChain is string|SyncExpressionChain}
 */
export function isStringOrSyncExpressionChain (expressionChain: NullableExpressionChain): expressionChain is string|SyncExpressionChain {
	return isPureStringExpressionChain(expressionChain) || isSyncExpressionChain(expressionChain);
}

/**
 * Takes Expressions or strings for an ExpressionChain
 * @param {ExpressionChain} expressionChain
 * @returns {ExpressionOrString[]}
 */
export function takeExpressionsOrStrings (expressionChain: ExpressionChain): ExpressionOrString[] {
	if (isPureStringExpressionChain(expressionChain)) return [expressionChain];
	if (isSyncExpressionChain(expressionChain)) return expressionChain;
	return expressionChain[1];
}

/**
 * Returns true if the given ExpressionChain contains at least one Expression
 * @param {ExpressionChain} expressionChain
 * @returns {boolean}
 */
export function expressionChainContainsExpression (expressionChain: ExpressionChain): boolean {
	return !isPureStringExpressionChain(expressionChain) && takeExpressionsOrStrings(expressionChain).some(isExpression);
}

/**
 * Returns true if the given item is a ExpressionChain
 * @param {NullableExpressionChain} item
 * @returns {boolean}
 */
export function isExpressionChain (item: NullableExpressionChain|ExpressionChainDict): item is ExpressionChain {
	return (typeof item === "string" || Array.isArray(item));

}