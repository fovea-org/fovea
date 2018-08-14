import {ICustomAttribute, IFoveaHost, isExpression, Json} from "@fovea/common";
import {ITemplateListener} from "../../template/template-listener/i-template-listener";
import {EvaluateExpressionChainResult} from "../../observe/expression-chain/evaluate-expression-chain/i-evaluate-expression-chain-result";
import {IListenResult} from "../../listen/i-listen-result";
import {listen} from "../../listen/listen";

/**
 * Invoked when a property should change
 * @param {IFoveaHost|ICustomAttribute} host
 * @param {Element} node
 * @param {ITemplateListener} listener
 * @param {Function} newHandler
 * @returns {IListenResult}
 */
export function onListenerHandlerShouldUpdate (host: IFoveaHost|ICustomAttribute, node: Element, listener: ITemplateListener, newHandler: (e: Event, name: string) => EvaluateExpressionChainResult): IListenResult {
	// Check if it includes at least one expression
	const containsExpression = listener.handler.some(part => isExpression(part));
	return listen({on: node, rawOn: node, host, once: false, handler: containsExpression ? newHandler : (<Json>newHandler)(), name: listener.name});
}