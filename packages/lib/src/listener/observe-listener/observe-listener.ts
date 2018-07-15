import {IExpressionChainObserver} from "../../observe/expression-chain/expression-chain-observer/i-expression-chain-observer";
import {UpgradedExpressionChain} from "../../observe/expression-chain/upgraded-expression-chain/upgraded-expression-chain";
import {ITemplateVariables} from "../../template/template-variables/i-template-variables";
import {EvaluateExpressionChainResult} from "../../observe/expression-chain/evaluate-expression-chain/i-evaluate-expression-chain-result";
import {upgradeExpressionChain} from "../../observe/expression-chain/upgrade-expression-chain/upgrade-expression-chain";
import {constructType} from "../../prop/construct-type/construct-type";
import {copyTemplateVariables} from "../../template/template-variables/copy-template-variables";
import {evaluateExpressionChain} from "../../observe/expression-chain/evaluate-expression-chain/evaluate-expression-chain";
import {ITemplateListener} from "../../template/template-listener/i-template-listener";
import {IFoveaHost, ICustomAttribute} from "@fovea/common";
import {onListenerHandlerShouldUpdate} from "../on-listener-handler-should-update/on-listener-handler-should-update";

/*# IF hasTemplateListeners */

/**
 * Observes the expression that binds a listener for the given host on the given element
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {Element} element
 * @param {ITemplateListener} listener
 * @param {ITemplateVariables} templateVariables
 * @returns {IExpressionChainObserver}
 */
export function observeListener (host: IFoveaHost|ICustomAttribute, element: Element, listener: ITemplateListener, templateVariables?: ITemplateVariables): IExpressionChainObserver {
	let upgradedExpressionChain: UpgradedExpressionChain|null = null;
	let variables: ITemplateVariables|null = null;

	// Invokes the provided event handler. Performs as much work lazily as possible
	const invoke = (event: Event): EvaluateExpressionChainResult => {
		if (upgradedExpressionChain == null) upgradedExpressionChain = upgradeExpressionChain(listener.handler, constructType("function"));
		if (variables == null) variables = copyTemplateVariables(templateVariables);

		variables.event = event;

		return evaluateExpressionChain(host, upgradedExpressionChain, variables);
	};

	return onListenerHandlerShouldUpdate(host, element, listener, invoke);
} /*# END IF hasTemplateListeners */