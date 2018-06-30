import {CustomAttributeRegistry} from "./custom-attribute-registry";

/*# IF hasTemplateCustomAttributes */

/**
 * Exports a new instance of CustomAttributeRegistry
 * @type {CustomAttributeRegistry}
 */
export const customAttributes = new CustomAttributeRegistry(); /*# END IF hasTemplateCustomAttributes */