import {IExpressionChainObserver} from "../../observe/expression-chain/expression-chain-observer/i-expression-chain-observer";
import {getCoerceTypeForAttributeName} from "../get-coerce-type-for-attribute-name/get-coerce-type-for-attribute-name";
import {observeExpressionChain} from "../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {onAttributeShouldUpdate} from "../on-attribute-should-update/on-attribute-should-update";
import {IFoveaHost, ICustomAttribute, IFoveaHostConstructor, ExpressionChain} from "@fovea/common";
import {ITemplateProperty} from "../../template/template-property/i-template-property";
import {ITemplateVariables} from "../../template/template-variables/i-template-variables";

/*# IF hasTemplateAttributes */

/**
 * The inner logic for the observeAttribute function
 * @param {IFoveaHost|ICustomAttribute} host
 * @param {Element} element
 * @param {ITemplateProperty} attribute
 * @param {string} propertyName
 * @param {ExpressionChain | undefined} expressionChain
 * @param {boolean} append
 * @param {ITemplateVariables} [templateVariables]
 * @returns {IExpressionChainObserver}
 */
function observeInner (host: IFoveaHost|ICustomAttribute, element: Element, attribute: ITemplateProperty, propertyName: string, expressionChain: ExpressionChain|undefined, append: boolean, templateVariables?: ITemplateVariables): IExpressionChainObserver {
	const type = getCoerceTypeForAttributeName(propertyName, append, <IFoveaHostConstructor> element.constructor);

	return observeExpressionChain<string|boolean>({
		coerceTo: type,
		host,
		// If no value is given, provide the empty string as value
		expressions: expressionChain != null ? expressionChain : [""],
		templateVariables,
		onChange: newValue => onAttributeShouldUpdate(host, element, attribute, type, newValue, !append ? undefined : propertyName)
	});
}

/**
 * Adds the given ExpressionChain or IExpressionChainDict to the given host
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {Element} element
 * @param {ITemplateProperty} attribute
 * @param {ITemplateVariables} [templateVariables]
 * @returns {IExpressionChainObserver}
 */
export function observeAttribute (host: IFoveaHost|ICustomAttribute, element: Element, attribute: ITemplateProperty, templateVariables?: ITemplateVariables): IExpressionChainObserver {

	if (attribute.value == null || Array.isArray(attribute.value)) {
		return observeInner(host, element, attribute, attribute.key, attribute.value, false, templateVariables);
	}

	else {
		let observers: IExpressionChainObserver[]|null = Object.entries(attribute.value).map(([propertyName, chain]) => observeInner(host, element, attribute, propertyName, chain, true, templateVariables));
		return {
			unobserve: () => {
				if (observers != null) {
					observers.forEach(observer => observer.unobserve());
					observers = null;
				}
			}
		};
	}
} /*# END IF hasTemplateAttributes */