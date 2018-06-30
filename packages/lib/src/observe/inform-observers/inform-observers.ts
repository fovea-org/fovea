import {formatObserverKey, invokeObservedExpressionOnChangeHandlers} from "../expression-chain/observe-expression-chain/observe-expression-chain";
import {Change} from "../observe/change/change";
import {AnyHost} from "../../host/any-host/any-host";

/**
 * Informs all observes about a change
 * @param {AnyHost} host
 * @param {string} property
 * @param {Change} [change]
 * @returns {void}
 */
export function informObservers<T> (host: AnyHost, property: string, change?: Change<T>): void {

	// Format an identifier
	const identifier = formatObserverKey(host, property);

	// Inform observers.
	invokeObservedExpressionOnChangeHandlers(host, identifier, change);
}