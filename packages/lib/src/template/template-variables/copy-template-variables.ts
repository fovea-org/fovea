import {ITemplateVariables} from "./i-template-variables";

/**
 * Copies some TemplateVariables, including PropertyDescriptors
 * @param {ITemplateVariables?} templateVariables
 * @returns {ITemplateVariables}
 */
export function copyTemplateVariables (templateVariables?: ITemplateVariables): ITemplateVariables {
	if (templateVariables == null) return {};
	const descriptors = Object.getOwnPropertyDescriptors(templateVariables);
	return Object.defineProperties({}, descriptors);
}