import {BOUND_STATIC_CSS_FOR_ROOT} from "./bound-static-css-for-root";

/*# IF hasStaticCSS */

/**
 * Adds the given DocumentFragment to the set of all style DocumentFragments added to the given root
 * @param {Element|ShadowRoot} root
 * @param {DocumentFragment} css
 * @returns {void}
 */
export function setStaticCSSForRoot (root: Element|ShadowRoot, css: DocumentFragment): void {
	BOUND_STATIC_CSS_FOR_ROOT.add(root, css);
} /*# END IF hasStaticCSS */