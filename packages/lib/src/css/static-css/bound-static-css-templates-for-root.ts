import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/*# IF hasStaticCSS */

/**
 * A Map between roots and the HTMLTemplateElements containing static styles that has been added to them
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, HTMLTemplateElement>}
 */
export const BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT: WeakMultiMap<Element|ShadowRoot, HTMLTemplateElement> = new WeakMultiMap(); /*# END IF hasStaticCSS */