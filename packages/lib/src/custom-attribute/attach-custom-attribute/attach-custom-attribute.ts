import {IObserver} from "../../observe/i-observer";
import {constructCustomAttribute} from "../construct-custom-attribute";
import {normalizeCustomAttributeExpressionValue} from "../../template/normalize-custom-attribute-expression-value/normalize-custom-attribute-expression-value";
import {getTypeForPropName} from "../../prop/type-for-prop-name/get-type-for-prop-name";
import {observeExpressionChain} from "../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {ExpressionChain, FoveaHost, ICustomAttributeConstructor, ExpressionChainDict} from "@fovea/common";
import {ITemplateVariables} from "../../template/template-variables/i-template-variables";
import {onCustomAttributeValueShouldUpdate} from "../on-custom-attribute-should-update/on-custom-attribute-should-update";
import {IDestroyable} from "../../destroyable/i-destroyable";

/**
 * Adds the given Custom Attribute to the given host
 * @param {FoveaHost} host
 * @param {Element} element
 * @param {string} name
 * @param {ExpressionChain | ExpressionChainDict} [value]
 * @param {ITemplateVariables} [templateVariables
 * @returns {IObserver}
 */
export function attachCustomAttribute (host: FoveaHost, element: Element, name: string, value?: ExpressionChain|ExpressionChainDict, templateVariables?: ITemplateVariables): IObserver&IDestroyable {
	const customAttribute = constructCustomAttribute(element, name);

	// If no Custom Attribute could be constructed, return a noop
	if (customAttribute == null) {
		return {
			destroy: () => {
			},
			unobserve: () => {
			}
		};
	}

	const normalizedValue = normalizeCustomAttributeExpressionValue(value);

	let observers: IObserver[]|null = Object.entries(normalizedValue).map(([propertyName, chain]) => {
		const type = getTypeForPropName(<ICustomAttributeConstructor> customAttribute.constructor, propertyName);
		return observeExpressionChain({
			coerceTo: type,
			host,
			expressions: chain == null ? [] : chain,
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
			if (customAttribute.destroyedCallback != null) {
				customAttribute.destroyedCallback.call(customAttribute);
			}
		},
		unobserve
	};
}