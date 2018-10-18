import {WeakMultiMap} from "@fovea/common";

/**
 * A Map between roots and the DocumentFragments containing static styles that has been added to them
 * @type {WeakMultiMap<Element|ShadowRoot, DocumentFragment>}
 */
export const BOUND_STATIC_CSS_FOR_ROOT: WeakMultiMap<Element|ShadowRoot, DocumentFragment> = new WeakMultiMap();