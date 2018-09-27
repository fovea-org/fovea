import {observeExpressionChain} from "../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {ExpressionChain, FoveaHost, FoveaHostConstructor, isExpressionChain} from "@fovea/common";
import {ITemplateProperty} from "../../template/template-property/i-template-property";
import {ITemplateVariables} from "../../template/template-variables/i-template-variables";
import {getTypeForPropName} from "../type-for-prop-name/get-type-for-prop-name";
import {onPropertyShouldUpdate} from "../on-property-should-update/on-property-should-update";
import {IObserver} from "../../observe/i-observer";

/**
 * The inner logic for the observeAttribute function
 * @param {FoveaHost} host
 * @param {Element} element
 * @param {string} propertyName
 * @param {ExpressionChain | undefined} expressionChain
 * @param {ITemplateVariables} [templateVariables]
 * @returns {IObserver}
 */
function observeInner (host: FoveaHost, element: Element, propertyName: string, expressionChain: ExpressionChain|undefined, templateVariables?: ITemplateVariables): IObserver {
	const type = getTypeForPropName(<FoveaHostConstructor>element.constructor, propertyName);

	return observeExpressionChain<string>({
		coerceTo: type,
		host,
		// If no value is given, provide the empty string as value
		expressions: expressionChain != null ? expressionChain : [""],
		templateVariables,
		onChange: newValue => onPropertyShouldUpdate(element, propertyName, newValue)
	});
}

/**
 * Adds the given ExpressionChain or ExpressionChainDict to the given host
 * @param {FoveaHost} host
 * @param {Element} element
 * @param {ITemplateProperty} property
 * @param {ITemplateVariables} [templateVariables]
 * @returns {IObserver}
 */
export function observeProperty (host: FoveaHost, element: Element, property: ITemplateProperty, templateVariables?: ITemplateVariables): IObserver {
	if (property.value == null || isExpressionChain(property.value)) {
		return observeInner(host, element, property.key, property.value, templateVariables);
	}

	else {
		let observers: IObserver[]|null = Object.entries(property.value).map(([propertyName, chain]) => observeInner(host, element, propertyName, chain, templateVariables));
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