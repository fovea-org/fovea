import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/*# IF hasStaticCSS */

/**
 * A Map between roots and the DocumentFragments containing static styles that has been added to them
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, DocumentFragment>}
 */
export const BOUND_STATIC_CSS_FOR_ROOT: WeakMultiMap<Element|ShadowRoot, DocumentFragment> = new WeakMultiMap(); /*# END IF hasStaticCSS */