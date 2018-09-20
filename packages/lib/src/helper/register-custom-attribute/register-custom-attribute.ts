import {ICustomAttributeConstructor} from "@fovea/common";
import {customAttributes} from "../../custom-attribute/custom-attributes";
import {log} from "../../log/log";

/**
 * Registers a Custom Attribute
 * @param {string} name
 * @param {ICustomAttributeConstructor} host
 * @private
 */
export function ___registerCustomAttribute (name: string, host: ICustomAttributeConstructor): void {
	try {
		customAttributes.define(name, host);
	} catch (ex) {
		log(`The host: '${host.name}' attempts to declare a Custom Attribute with the selector: '${name}', but a Custom Attribute with that selector has already been registered!`);
	}
}