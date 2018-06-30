import {ICustomAttributeConstructor} from "@fovea/common";
import {customAttributes} from "../../custom-attribute/custom-attributes";

/*# IF hasTemplateCustomAttributes */

/**
 * Registers a Custom Attribute
 * @param {string} name
 * @param {ICustomAttributeConstructor} host
 * @private
 */
export function __registerCustomAttribute (name: string, host: ICustomAttributeConstructor): void {
	customAttributes.define(name, host);
} /*# END IF hasTemplateCustomAttributes */