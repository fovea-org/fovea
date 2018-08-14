import {ICustomAttribute, IFoveaHost, Json} from "@fovea/common";
import {setExpectedAttributeValue} from "../expected-attribute-value/set-expected-attribute-value/set-expected-attribute-value";
import {coerceValue} from "../../observe/expression-chain/coercion/coerce-value";
import {constructType} from "../../prop/construct-type/construct-type";
import {isHTMLElement} from "../../element/is-html-element";
import {NonReadonly} from "../../non-readonly/non-readonly";
import {kebabCase} from "@wessberg/stringutil";

// tslint:disable:no-any
// tslint:disable:strict-boolean-expressions

/**
 * Updates the given value on the given element as an attribute
 * @param {IFoveaHost|ICustomAttribute} host
 * @param {Element} element
 * @param {string} key
 * @param {Json} value
 * @param {boolean} isBooleanProp
 * @param {string?} [setForValueProperty]
 * @returns {void}
 */
export function setAttribute (host: IFoveaHost|ICustomAttribute, element: Element, key: string, value: Json, isBooleanProp: boolean, setForValueProperty?: string): void {
	// Remove the attribute if it represents a boolean property and the new value is either not given or false
	const shouldRemoveAttribute = value == null || isBooleanProp && !value;

	// If the value should be set for a nested value of the attribute (for example, for a style attribute, the newValue may relate to only one of the key-value pairs of it),
	// Traverse the current attribute, if any, and add the value to it
	if (setForValueProperty != null) {

		switch (key) {
			case "style": {
				if (isHTMLElement(element)) {
					// If the property exists in the CSSStyleDeclaration of the user agent, it is enough to set it on the "style" property of the element
					// in order for it to bubble up on the host element. Otherwise, we need to append/remove the style property manually
					if (setForValueProperty in element.style) {
						(<NonReadonly<CSSStyleDeclaration>>element.style)[<keyof CSSStyleDeclaration>setForValueProperty] = shouldRemoveAttribute ? null : value;
					}
					// Append/remove the style property manually
					else {
						// kebab-case/dash-case the CSS property. For example, 'touchAction' becomes 'touch-action'
						const kebabCasedProperty = kebabCase(setForValueProperty);
						// Generate a Regular Expression to match it within the style attribute
						const regexp = new RegExp(`${kebabCasedProperty}:[^;]*;?`, "g");
						// Prepare a new value for it
						const replacement = `${kebabCasedProperty}: ${value};`;

						// Take the existing value of the attribute (or otherwise fallback to the empty string) and remove the style property from it
						const styleAttributeValue: string = (element.getAttribute("style") || "").replace(regexp, "");

						// Set the attribute. If the style property should be removed, use the existing value. Otherwise, prepend the replacement
						element.setAttribute("style", shouldRemoveAttribute
							? styleAttributeValue
							: `${replacement}${styleAttributeValue}`
						);
					}
					// Cache the expected attribute value
					setExpectedAttributeValue(host, key, element.getAttribute("style"));
				}
				return;
			}

			case "class": {
				shouldRemoveAttribute ? element.classList.remove(setForValueProperty) : element.classList.add(setForValueProperty);
				// Cache the expected attribute value
				setExpectedAttributeValue(host, key, element.getAttribute("class"));
				return;
			}
		}
	}

	// If the prop is the literal 'true', replace the value with the empty string. Otherwise, coerce the value into a string
	const normalizedValue = isBooleanProp && value === true ? "" : coerceValue(value, constructType("string"));

	// Cache the expected attribute value
	setExpectedAttributeValue(host, key, shouldRemoveAttribute ? null : normalizedValue);

	// Either remove or set the attribute, depending on the value of 'isFalsy'
	shouldRemoveAttribute
		? element.removeAttribute(key)
		: element.setAttribute(key, normalizedValue);
}