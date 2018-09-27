import {getCoerceTypeForAttributeName} from "../get-coerce-type-for-attribute-name/get-coerce-type-for-attribute-name";
import {onAttributeShouldUpdate} from "../on-attribute-should-update/on-attribute-should-update";
import {ExpressionChain, FoveaHost, FoveaHostConstructor, isExpressionChain} from "@fovea/common";
import {ITemplateProperty} from "../../template/template-property/i-template-property";
import {ITemplateVariables} from "../../template/template-variables/i-template-variables";
import {observeExpressionChain} from "../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {IObserver} from "../../observe/i-observer";

/**
 * The inner logic for the observeAttribute function
 * @param {FoveaHost} host
 * @param {Element} element
 * @param {ITemplateProperty} attribute
 * @param {string} propertyName
 * @param {ExpressionChain | undefined} expressionChain
 * @param {boolean} append
 * @param {ITemplateVariables} [templateVariables]
 * @returns {IObserver}
 */
function observeInner (host: FoveaHost, element: Element, attribute: ITemplateProperty, propertyName: string, expressionChain: ExpressionChain|undefined, append: boolean, templateVariables?: ITemplateVariables): IObserver {
	const type = getCoerceTypeForAttributeName(propertyName, append, <FoveaHostConstructor> element.constructor);

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
 * @param {FoveaHost} host
 * @param {Element} element
 * @param {ITemplateProperty} attribute
 * @param {ITemplateVariables} [templateVariables]
 * @returns {IObserver}
 */
export function observeAttribute (host: FoveaHost, element: Element, attribute: ITemplateProperty, templateVariables?: ITemplateVariables): IObserver {
	if (attribute.value == null || isExpressionChain(attribute.value)) {
		return observeInner(host, element, attribute, attribute.key, attribute.value, false, templateVariables);
	}

	else {
		let observers: IObserver[]|null = Object.entries(attribute.value).map(([propertyName, chain]) => observeInner(host, element, attribute, propertyName, chain, true, templateVariables));
		return {
			unobserve: () => {
				if (observers != null) {
					observers.forEach(observer => observer.unobserve());
					observers = null;
				}
			}
		};
	}
}