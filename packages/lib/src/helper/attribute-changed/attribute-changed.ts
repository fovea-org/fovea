import {FoveaHost, FoveaHostConstructor, Json} from "@fovea/common";
import {getExpectedAttributeValue} from "../../attribute/expected-attribute-value/get-expected-attribute-value/get-expected-attribute-value";
import {getPropNameForAttributeName} from "../../prop/prop-name-to-attribute-name/get-prop-name-for-attribute-name/get-prop-name-for-attribute-name";
import {setExpectedAttributeValue} from "../../attribute/expected-attribute-value/set-expected-attribute-value/set-expected-attribute-value";
import {PROPS_FOR_HOST} from "../../prop/props-for-host/props-for-host/props-for-host";
import {coerceValue} from "../../observe/expression-chain/coercion/coerce-value";

// tslint:disable:no-any

/**
 * A helper function that will be invoked when an attribute changes on an FoveaHost
 * @param {Json} _host
 * @param {string} attributeName
 * @param {string|null} _oldValue
 * @param {string|null} newValue
 * @private
 */
export function ___attributeChanged (_host: Json, attributeName: string, _oldValue: string|null, newValue: string|null): void {
	const host = _host as FoveaHost;

	// Start with getting the expected attribute value and see if it is identical to the new value
	const expectedAttributeValue = getExpectedAttributeValue(host, attributeName);
	// If it is identical, return immediately
	if (expectedAttributeValue === newValue) return;

	// Otherwise, first cache the new attribute value as the expected one
	setExpectedAttributeValue(host, attributeName, newValue);

	// Normalize the value and set it as a property
	const matchingPropName = getPropNameForAttributeName(attributeName);

	// If no prop matches the attribute, do no more
	if (matchingPropName == null) return;

	// Get the prop that matches the changed attribute name
	const matchingProp = PROPS_FOR_HOST.findValue(<FoveaHostConstructor>host.constructor, prop => prop.name === matchingPropName);

	// If there is no matching prop, return immediately
	if (matchingProp == null) return;

	// Assign the new value to the host
	const coercedValue = coerceValue(newValue, matchingProp.type);
	if ((<any>host)[matchingPropName] !== coercedValue) {
		(<any>host)[matchingPropName] = coercedValue;
	}
}