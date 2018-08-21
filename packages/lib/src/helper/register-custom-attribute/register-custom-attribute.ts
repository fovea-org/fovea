import {ICustomAttributeConstructor} from "@fovea/common";
import {customAttributes} from "../../custom-attribute/custom-attributes";

/**
 * Registers a Custom Attribute
 * @param {string} name
 * @param {ICustomAttributeConstructor} host
 * @private
 */
export function ___registerCustomAttribute (name: string, host: ICustomAttributeConstructor): void {
	customAttributes.define(name, host);
}