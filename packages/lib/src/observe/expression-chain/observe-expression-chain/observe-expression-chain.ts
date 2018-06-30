import {IExpressionChainObserver} from "../expression-chain-observer/i-expression-chain-observer";
import {IObserveExpressionChainOptions} from "./i-observe-expression-chain-options";
import {Expression, isExpression, isUuid, Uuid} from "@fovea/common";
import {IObservedExpression} from "../observed-expression/i-observed-expression";
import {INullableObserveExpressionChainOptions} from "./i-nullable-observe-expression-chain-options";
import {getUuidForNode} from "../../../uuid/uuid-for-node/get-uuid-for-node/get-uuid-for-node";
import {IFormatObservedExpressionResult} from "./i-format-observed-expression-result";
import {evaluateExpressionChain} from "../evaluate-expression-chain/evaluate-expression-chain";
import {upgradeExpressionChain} from "../upgrade-expression-chain/upgrade-expression-chain";
import {evaluateAsyncExpressionChain} from "../evaluate-expression-chain/evaluate-async-expression-chain";
import {UpgradedExpressionChain} from "../upgraded-expression-chain/upgraded-expression-chain";
import {ExpressionChainObserverCallback} from "../expression-chain-observer-callback/expression-chain-observer-callback";
import {EvaluateExpressionChainResult} from "../evaluate-expression-chain/i-evaluate-expression-chain-result";
import {Change} from "../../observe/change/change";
import {AnyHost} from "../../../host/any-host/any-host";
import {ITemplateVariables} from "../../../template/template-variables/i-template-variables";
import {MultiMap} from "../../../multi-map/multi-map";

/**
 * A MultiMap between identifiers and an IObservedExpression
 * @type {Map<string, Set<IObservedExpression<{}>>>}
 */
const OBSERVED_EXPRESSIONS: MultiMap<string, IObservedExpression<{}>> = new MultiMap();

/**
 * A function that takes a chain of expressions, observes each of the observable parts of it
 * and, when any of them changes, reduces it and invokes the provided 'onChange' handler with the result
 * @param {IObserveExpressionChainOptions} options
 * @returns {IExpressionChainObserver}
 */
export function observeExpressionChain<T> (options: INullableObserveExpressionChainOptions<T>): IExpressionChainObserver {
	// Observe the expressions
	return observeSubstitutionExpressionChain(options);
}

/**
 * Formats an observer key for the given uuid and expression
 * @param {AnyHost|Uuid} hostOrUuid
 * @param {string} expression
 * @returns {string}
 */
export function formatObserverKey (hostOrUuid: AnyHost|Uuid, expression: string): string {
	const uuid = isUuid(hostOrUuid) ? hostOrUuid : getUuidForNode(hostOrUuid);
	return `${uuid}.${expression}`;
}

/**
 * Invokes the callbacks for an observed expression mapped to the provided identifier
 * @template T
 * @param {AnyHost} host
 * @param {string} observerKey
 * @param {Change<T>} [change]
 */
export function invokeObservedExpressionOnChangeHandlers<T> (host: AnyHost, observerKey: string, change?: Change<T>): void {

	// Evaluate all of the ExpressionChains
	OBSERVED_EXPRESSIONS.forEach(observerKey, ({expression, onChange, templateVariables}) => {
		evaluate(host, onChange, expression, templateVariables, change);
	});
}

/**
 * Called when an evaluation result has arrived
 * @param {Optional<Json>} newValue
 * @param {ExpressionChainObserverCallback<T>} onChange
 * @param {Change<T>} [change]
 */
function onEvaluateResult<T> (newValue: EvaluateExpressionChainResult, onChange: ExpressionChainObserverCallback<T>, change?: Change<T>): void {
	// Otherwise, invoke the 'onChange' handler
	onChange(newValue, change);
}

/**
 * Evaluates an UpgradedExpressionChain
 * @param {AnyHost} host
 * @param {ExpressionChainObserverCallback<T>} onChange
 * @param {UpgradedExpressionChain} chain
 * @param {ITemplateVariables} [templateVariables]
 * @param {Change<T>} [change]
 */
function evaluate<T> (host: AnyHost, onChange: ExpressionChainObserverCallback<T>, chain: UpgradedExpressionChain, templateVariables?: ITemplateVariables, change?: Change<T>): void {

	// If it isn't async, use the synchronous evaluator
	if (!chain.isAsync) {
		onEvaluateResult(evaluateExpressionChain(host, chain, templateVariables), onChange, change);
	}

	else {
		/*# IF hasAsyncEvaluations */
		evaluateAsyncExpressionChain(host, chain, templateVariables).then(result => onEvaluateResult(result, onChange, change));  /*# END IF hasAsyncEvaluations */
	}
}

/**
 * Observes an ExpressionChain with substitutions. When any of the underlying expressions change, the provided 'onChange' handler will
 * be invoked.
 * @param {IObserveExpressionChainOptions<T>} options
 * @returns {IExpressionChainObserver}
 */
function observeSubstitutionExpressionChain<T> (options: INullableObserveExpressionChainOptions<T>): IExpressionChainObserver {
	let disposers: Set<() => void>|undefined = new Set();

	if (options.expressions != null) {

		// Upgrade the ExpressionChain
		const upgradedExpressions = upgradeExpressionChain(options.expressions, options.coerceTo);

		upgradedExpressions.forEach(expression => {
			// Don't add observers for primitive values or expressions without any observable identifiers
			if (!isExpression(expression) || !hasObservableHostIdentifiers(expression)) return;

			// Otherwise, add the observed expressions
			const observedExpressions = formatObservedExpressions(expression, <IObserveExpressionChainOptions<T>> options);
			observedExpressions.forEach(({observerKey, observedExpression}) => {
				// Add a function to clear the observed expression when it is disposed
				disposers!.add(() => OBSERVED_EXPRESSIONS.deleteValue(observerKey, observedExpression));
			});
		});

		// Evaluate the ExpressionChain
		evaluate(options.host, options.onChange, upgradedExpressions, options.templateVariables);
	}

	// Return an IExpressionChainObserver
	return {
		unobserve: disposers.size < 1
			// Return a noop
			? () => {
			}
			// Return a arrow function that can clean-up the observers
			: () => {
				disposers!.forEach(disposer => disposer());
				disposers!.clear();

				// Mark for garbage collection
				disposers = undefined;
			}
	};
}

/**
 * Adds an observed expression to the Set of all observed expressions matching the combination
 * of the provided uuid and expression
 * @param {Expression} expression
 * @param {UpgradedExpressionChain} expressions
 * @param {ExpressionChainObserverCallback<T>} onChange
 * @param {IFoveaHost} host
 * @param {ITemplateVariables} [templateVariables]
 * @returns {string}
 */
function formatObservedExpressions<T> (expression: Expression, {expressions, onChange, host, templateVariables}: IObserveExpressionChainOptions<T>): IFormatObservedExpressionResult<T>[] {
	return takeHostIdentifiersFromExpression(expression).map(identifier => {
		// Format the observerKey
		const observerKey = formatObserverKey(host, identifier);

		// Format an observed expression and add it
		const observedExpression = {expression: expressions, onChange, templateVariables};
		OBSERVED_EXPRESSIONS.add(observerKey, observedExpression);

		// Return the observed expression and the observerKey
		return {observerKey, observedExpression};
	});
}

/**
 * Takes all host identifiers from an expression and returns an array of them
 * @param {Expression} expression
 * @returns {string[]}
 */
function takeHostIdentifiersFromExpression (expression: Expression): string[] {
	const [, identifiers] = expression;
	return identifiers;
}

/**
 * Returns true if the expression has one or more host identifiers that can be observed
 * @param {Expression} expression
 * @returns {boolean}
 */
function hasObservableHostIdentifiers (expression: Expression): boolean {
	return takeHostIdentifiersFromExpression(expression).length > 0;
}