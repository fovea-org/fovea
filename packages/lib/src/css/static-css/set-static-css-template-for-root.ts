import {BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT} from "./bound-static-css-templates-for-root";

/**
 * Adds the given template to the set of all templates added to the given root
 * @param {Element|ShadowRoot} root
 * @param {HTMLTemplateElement} template
 * @returns {void}
 */
export function setStaticCSSTemplateForRoot (root: Element|ShadowRoot, template: HTMLTemplateElement): void {
	BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT.add(root, template);
}