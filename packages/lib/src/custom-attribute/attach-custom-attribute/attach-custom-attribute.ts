import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";
import {IObserver} from "../../observe/i-observer";
import {constructCustomAttribute} from "../construct-custom-attribute";
import {normalizeCustomAttributeExpressionValue} from "../../template/normalize-custom-attribute-expression-value/normalize-custom-attribute-expression-value";
import {IExpressionChainObserver} from "../../observe/expression-chain/expression-chain-observer/i-expression-chain-observer";
import {getTypeForPropName} from "../../prop/type-for-prop-name/get-type-for-prop-name";
import {observeExpressionChain} from "../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {ExpressionChain, ICustomAttribute, ICustomAttributeConstructor, IFoveaHost} from "@fovea/common";
import {ITemplateVariables} from "../../template/template-variables/i-template-variables";
import {onCustomAttributeValueShouldUpdate} from "../on-custom-attribute-should-update/on-custom-attribute-should-update";
import {IDestroyable} from "../../destroyable/i-destroyable";
import {___destroy} from "../../helper/destroy/destroy";

/**
 * Adds the given Custom Attribute to the given host
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {Element} element
 * @param {string} name
 * @param {ExpressionChain | IExpressionChainDict} [value]
 * @param {ITemplateVariables} [templateVariables
 * @returns {IObserver}
 */
export function attachCustomAttribute (host: IFoveaHost|ICustomAttribute, element: Element, name: string, value?: ExpressionChain|IExpressionChainDict, templateVariables?: ITemplateVariables): IObserver&IDestroyable {
	const customAttribute = constructCustomAttribute(element, name);

	// If no Custom Attribute could be constructed, return a noop
	if (customAttribute == null) {
		return {
			destroy: () => {},
			unobserve: () => {}
		};
	}

	const normalizedValue = normalizeCustomAttributeExpressionValue(value);

	let observers: IExpressionChainObserver[]|null = Object.entries(normalizedValue).map(([propertyName, chain]) => {
		const type = getTypeForPropName(<ICustomAttributeConstructor> customAttribute.constructor, propertyName);
		return observeExpressionChain({
			coerceTo: type,
			host,
			expressions: chain,
			templateVariables,
			onChange: newValue => onCustomAttributeValueShouldUpdate(customAttribute, {key: propertyName, value: chain}, newValue)
		});
	});

	const unobserve = () => {
		if (observers != null) {
			observers.forEach(observer => observer.unobserve());
			observers = null;
		}
	};

	return {
		destroy: () => {
			unobserve();
			___destroy(customAttribute);
		},
		unobserve
	};
}