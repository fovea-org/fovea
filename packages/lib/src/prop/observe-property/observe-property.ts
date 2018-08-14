import {IExpressionChainObserver} from "../../observe/expression-chain/expression-chain-observer/i-expression-chain-observer";
import {observeExpressionChain} from "../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {ExpressionChain, ICustomAttribute, IFoveaHost, IFoveaHostConstructor} from "@fovea/common";
import {ITemplateProperty} from "../../template/template-property/i-template-property";
import {ITemplateVariables} from "../../template/template-variables/i-template-variables";
import {getTypeForPropName} from "../type-for-prop-name/get-type-for-prop-name";
import {onPropertyShouldUpdate} from "../on-property-should-update/on-property-should-update";

/**
 * The inner logic for the observeAttribute function
 * @param {IFoveaHost|ICustomAttribute} host
 * @param {Element} element
 * @param {string} propertyName
 * @param {ExpressionChain | undefined} expressionChain
 * @param {ITemplateVariables} [templateVariables]
 * @returns {IExpressionChainObserver}
 */
function observeInner (host: IFoveaHost|ICustomAttribute, element: Element, propertyName: string, expressionChain: ExpressionChain|undefined, templateVariables?: ITemplateVariables): IExpressionChainObserver {
	const type = getTypeForPropName(<IFoveaHostConstructor>element.constructor, propertyName);

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
 * Adds the given ExpressionChain or IExpressionChainDict to the given host
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {Element} element
 * @param {ITemplateProperty} property
 * @param {ITemplateVariables} [templateVariables]
 * @returns {IExpressionChainObserver}
 */
export function observeProperty (host: IFoveaHost|ICustomAttribute, element: Element, property: ITemplateProperty, templateVariables?: ITemplateVariables): IExpressionChainObserver {

	if (property.value == null || Array.isArray(property.value)) {
		return observeInner(host, element, property.key, property.value, templateVariables);
	}

	else {
		let observers: IExpressionChainObserver[]|null = Object.entries(property.value).map(([propertyName, chain]) => observeInner(host, element, propertyName, chain, templateVariables));
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