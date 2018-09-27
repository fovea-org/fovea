import {AsyncExpressionChain, Expression, ExpressionChain, isPureStringExpressionChain, isSyncExpressionChain, isUuid, SyncExpressionChain, takeExpressionsOrStrings, Uuid} from "@fovea/common";
import {IObservedExpression} from "./i-observed-expression";
import {evaluateAsyncExpressionChain} from "../evaluate-expression-chain/evaluate-async-expression-chain";
import {EvaluateExpressionChainResult} from "../evaluate-expression-chain/i-evaluate-expression-chain-result";
import {Change} from "../../observe/change/change";
import {AnyHost} from "../../../host/any-host/any-host";
import {MultiMap} from "../../../multi-map/multi-map";
import {IObserver} from "../../i-observer";
import {evaluateSyncExpressionChain} from "../evaluate-expression-chain/evaluate-sync-expression-chain";

// tslint:disable:no-any

/**
 * A noop expression chain observer that simply does nothing
 * @type {{unobserve: () => void}}
 */
const NOOP_EXPRESSION_CHAIN_OBSERVER: IObserver = {
	unobserve: () => {
	}
};

/**
 * A MultiMap between identifiers and an IObservedExpression
 * @type {Map<string, Set<IObservedExpression<{}>>>}
 */
const OBSERVED_EXPRESSIONS: MultiMap<string, IObservedExpression<{}>> = new MultiMap();

/**
 * Disposes the given observed expression for the given observer key
 * @param {string} observerKey
 * @param {IObservedExpression<T>} observedExpression
 */
function disposeObservedExpressionForObserverKey<T> (observerKey: string, observedExpression: IObservedExpression<T>): void {
	OBSERVED_EXPRESSIONS.deleteValue(observerKey, observedExpression);
}

/**
 * Disposes the given observed expression for the given observer keys
 * @param {Set<string>} observerKeys
 * @param {IObservedExpression<T>} observedExpression
 */
function disposeObservedExpressionForObserverKeys<T> (observerKeys: Set<string>, observedExpression: IObservedExpression<T>): void {
	for (const observerKey of observerKeys) disposeObservedExpressionForObserverKey(observerKey, observedExpression);
}

/**
 * Disposes the given observed expression for the given observer keys
 * @param {Set<string>} observerKeys
 * @param {IObservedExpression<T>} observedExpression
 */
function observedExpressionObserver<T> (observerKeys: Set<string>, observedExpression: IObservedExpression<T>): IObserver {
	return {unobserve: disposeObservedExpressionForObserverKeys.bind(null, observerKeys, observedExpression)};
}

/**
 * Adds an observed expression to the Set of all observed expressions matching the combination
 * of the provided uuid and expression
 * @param {AnyHost} host
 * @param {Expression} expression
 * @returns {string}
 */
function takeObserverKeysForExpression (host: AnyHost, expression: Expression|string): string[] {
	const hostIdentifiers = takeHostIdentifiersFromExpression(expression);
	return hostIdentifiers.map(hostIdentifier => formatObserverKey(host, hostIdentifier));
}

/**
 * Takes all observer keys for the given ExpressionChain
 * @param {AnyHost} host
 * @param {ExpressionChain} expressionChain
 * @returns {Set<string>}
 */
function takeObserverKeysForExpressionChain (host: AnyHost, expressionChain: ExpressionChain): Set<string> {
	const keys: Set<string> = new Set();
	if (isPureStringExpressionChain(expressionChain)) return keys;

	for (const expression of takeExpressionsOrStrings(expressionChain)) {
		for (const key of takeObserverKeysForExpression(host, expression)) {
			keys.add(key);
		}
	}
	return keys;
}

/**
 * Adds an observer for the provided key
 * @param {string} key
 * @param {IObservedExpression<T>} observedExpression
 */
function addObserverForKey<T> (key: string, observedExpression: IObservedExpression<T>): void {
	OBSERVED_EXPRESSIONS.add(key, observedExpression);
}

/**
 * Adds an observer for all of the provided observer keys
 * @param {Set<string>} keys
 * @param {IObservedExpression<T>} observedExpression
 */
function addObserverForKeys<T> (keys: Set<string>, observedExpression: IObservedExpression<T>): void {
	for (const key of keys) {
		addObserverForKey(key, observedExpression);
	}
}

/**
 * Observers an expression chain
 * @param {IObservedExpression<T>} observedExpression
 * @returns {IObserver}
 */
export function observeExpressionChain<T> (observedExpression: IObservedExpression<T>): IObserver {
	// Takes all the keys that should be observed for the provided ExpressionChain
	const observerKeys = takeObserverKeysForExpressionChain(observedExpression.host, observedExpression.expressions);

	// If there's nothing to observe, evaluate the expressions immediately and return a noop observer
	if (observerKeys.size === 0) {
		// Evaluate the value immediately
		evaluate(undefined, observedExpression);
		return NOOP_EXPRESSION_CHAIN_OBSERVER;
	}

	// Add an observer for the keys
	addObserverForKeys(observerKeys, observedExpression);

	// Even if the expression is observed, a value may be emitted prior to hooking up the observer,
	// So we must always invoke 'evaluate' to ensure a value will be emitted
	evaluate(undefined, observedExpression);

	return observedExpressionObserver(observerKeys, observedExpression);
}

/**
 * Formats an observer key for the given uuid and expression
 * @param {AnyHost|Uuid} hostOrUuid
 * @param {string} expression
 * @returns {string}
 */
export function formatObserverKey (hostOrUuid: AnyHost|Uuid, expression: string): string {
	const uuid = isUuid(hostOrUuid) ? hostOrUuid : hostOrUuid.___uuid;
	return `${uuid}.${expression}`;
}

/**
 * Invokes the callbacks for an observed expression mapped to the provided identifier
 * @template T
 * @param {string} observerKey
 * @param {Change<T>} [change]
 */
export function evaluateObserverKey<T> (observerKey: string, change?: Change<T>): void {
	OBSERVED_EXPRESSIONS.forEach(observerKey, evaluate.bind(null, change));
}

/**
 * Called when an evaluation result has arrived
 * @param {EvaluateExpressionChainResult} newValue
 * @param {ExpressionChainObserverCallback<T>} observedExpression
 * @param {Change<T>} change
 */
function onEvaluateResult<T> (newValue: EvaluateExpressionChainResult, observedExpression: IObservedExpression<T>, change?: Change<T>): void {
	// Otherwise, invoke the 'onChange' handler
	observedExpression.onChange(newValue, change);
}

/**
 * Evaluates the given ExpressionChain based on the given options
 * @param {Change<T>?} change
 * @param {IObservedExpression<T>} observedExpression
 */
function evaluate<T> (change: Change<T>|undefined, observedExpression: IObservedExpression<T>): void {
	// If it isn't async, use the synchronous evaluator
	if (isPureStringExpressionChain(observedExpression.expressions) || isSyncExpressionChain(observedExpression.expressions)) {
		onEvaluateResult(evaluateSyncExpressionChain(<{ expressions: string|SyncExpressionChain }&Pick<IObservedExpression<T>, Exclude<keyof IObservedExpression<T>, "onChange"|"expressions">>>observedExpression), observedExpression, change);
	}

	else {
		evaluateAsyncExpressionChain(<{ expressions: AsyncExpressionChain }&Pick<IObservedExpression<T>, Exclude<keyof IObservedExpression<T>, "onChange"|"expressions">>>observedExpression).then(result => onEvaluateResult(result, observedExpression, change));
	}
}

/**
 * Takes all host identifiers from an expression and returns an array of them
 * @param {Expression} expression
 * @returns {string[]}
 */
function takeHostIdentifiersFromExpression (expression: Expression|string): string[] {
	if (typeof expression === "string") return [];
	const [, identifiers] = expression;
	return identifiers;
}