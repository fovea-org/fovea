import {WeakMultiMap} from "@fovea/common";

/**
 * A Map between roots and the HTMLTemplateElements containing static styles that has been added to them
 * @type {WeakMultiMap<Element|ShadowRoot, HTMLTemplateElement>}
 */
export const BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT: WeakMultiMap<Element|ShadowRoot, HTMLTemplateElement> = new WeakMultiMap();