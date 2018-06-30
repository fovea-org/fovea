import {BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT} from "./bound-static-css-templates-for-root";
/*# IF hasStaticCSS */
/**
 * Returns true if the given root has the given static CSS template
 * @param {Element|ShadowRoot} root
 * @param {HTMLTemplateElement} template
 * @returns {boolean}
 */
export function rootHasStaticCSSTemplate (root: Element|ShadowRoot, template: HTMLTemplateElement): boolean {
	return BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT.hasValue(root, template);
} /*# END IF hasStaticCSS */