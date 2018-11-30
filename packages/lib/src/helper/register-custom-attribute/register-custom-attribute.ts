import {ICustomAttributeConstructor, Json} from "@fovea/common";
import {customAttributes} from "../../custom-attribute/custom-attributes";
import {log} from "../../log/log";

/**
 * Registers a Custom Attribute
 * @param {string} name
 * @param {Json} _host
 * @private
 */
export function ___registerCustomAttribute (name: string, _host: Json): void {
	const host = _host as ICustomAttributeConstructor;
	try {
		customAttributes.define(name, host);
	} catch (ex) {
		log(`The host: '${host.name}' attempts to declare a Custom Attribute with the selector: '${name}', but a Custom Attribute with that selector has already been registered!`);
	}
}