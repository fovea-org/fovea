import {setAttributeNameForPropName} from "../../prop/prop-name-to-attribute-name/set-attribute-name-for-prop-name/set-attribute-name-for-prop-name";
import {PropertyToAttributeTuple} from "./property-to-attribute-tuple";

/**
 * Maps the properties of an IFoveaHost to their attribute counterparts.
 * @param {[string , string][]} tuples
 * @private
 */
export function __mapPropertiesToAttributes (...tuples: PropertyToAttributeTuple[]): void {
	tuples.forEach(tuple => {

		// If the tuple is just a string, the attribute name will be identical to the property name
		if (typeof tuple === "string") {
			setAttributeNameForPropName(tuple, tuple);
		}

		// Otherwise, the tuple contains the prop name as the first element and the attribute name as the second
		else {
			const [prop, attribute] = tuple;
			setAttributeNameForPropName(prop, attribute);
		}
	});
}