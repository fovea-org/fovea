import {ICustomAttribute, IFoveaHost, Json} from "@fovea/common";
import {setExpectedAttributeValue} from "../expected-attribute-value/set-expected-attribute-value/set-expected-attribute-value";
import {coerceValue} from "../../observe/expression-chain/coercion/coerce-value";
import {constructType} from "../../prop/construct-type/construct-type";

// tslint:disable:no-any

/*# IF hasTemplateAttributes || hasHostProps */

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
				if ("style" in element) {
					(<any>element).style[setForValueProperty] = shouldRemoveAttribute ? null : value;
					// Cache the expected attribute value
					setExpectedAttributeValue(host, key, (<any>element).style[setForValueProperty]);
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
} /*# END IF hasTemplateAttributes || hasHostProps */