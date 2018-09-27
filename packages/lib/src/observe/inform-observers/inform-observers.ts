import {evaluateObserverKey} from "../expression-chain/observe-expression-chain/observe-expression-chain";
import {Change} from "../observe/change/change";

/**
 * Informs all observes about a change
 * @param {string} observerKey
 * @param {Change} [change]
 * @returns {void}
 */
export function informObservers<T> (observerKey: string, change?: Change<T>): void {

	// Inform observers.
	evaluateObserverKey(observerKey, change);
}