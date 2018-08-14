import {customAttributes} from "./custom-attributes";
import {ICustomAttribute, Json} from "@fovea/common";

/**
 * Constructs a new ICustomAttribute
 * @param {Element} hostElement
 * @param {string} name
 * @returns {ICustomAttribute}
 */
export function constructCustomAttribute (hostElement: Element, name: string): ICustomAttribute {
	// Get the constructor for it
	const constructor = customAttributes.get(name);

	// if it isn't defined, throw an exception
	if (constructor == null) {
		throw new ReferenceError(`Error: An element: '${hostElement.tagName.toLowerCase()}' had the Custom Attribute: "${name}", but it couldn't be found. Make sure to import it!`);
	}

	// Otherwise, invoke the constructor and pass the element as a reference to it
	return new (<Json>constructor)(hostElement);
}