import {ITemplateVariables} from "../../template/template-variables/i-template-variables";
import {EvaluateExpressionChainResult} from "../../observe/expression-chain/evaluate-expression-chain/i-evaluate-expression-chain-result";
import {constructType} from "../../prop/construct-type/construct-type";
import {copyTemplateVariables} from "../../template/template-variables/copy-template-variables";
import {evaluateExpressionChain} from "../../observe/expression-chain/evaluate-expression-chain/evaluate-expression-chain";
import {ITemplateListener} from "../../template/template-listener/i-template-listener";
import {FoveaHost} from "@fovea/common";
import {onListenerHandlerShouldUpdate} from "../on-listener-handler-should-update/on-listener-handler-should-update";
import {IObserver} from "../../observe/i-observer";

/**
 * Observes the expression that binds a listener for the given host on the given element
 * @param {FoveaHost} host
 * @param {Element} element
 * @param {ITemplateListener} listener
 * @param {ITemplateVariables} templateVariables
 * @returns {IObserver}
 */
export function observeListener (host: FoveaHost, element: Element, listener: ITemplateListener, templateVariables?: ITemplateVariables): IObserver {
	let variables: ITemplateVariables|null = null;

	// Invokes the provided event handler. Performs as much work lazily as possible
	const invoke = (event: Event): EvaluateExpressionChainResult => {
		if (variables == null) variables = copyTemplateVariables(templateVariables);

		variables.event = event;

		return evaluateExpressionChain({host, templateVariables: variables, expressions: listener.handler, coerceTo: constructType("function")});
	};

	return onListenerHandlerShouldUpdate(host, element, listener, invoke);
}