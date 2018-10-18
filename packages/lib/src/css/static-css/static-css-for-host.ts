import {FoveaHostConstructor, WeakMultiMap} from "@fovea/common";

/**
 * A Map between FoveaHostConstructors and functions that retrieve HTMLTemplateElements for all static CSS that should be appended to them
 * @type {WeakMultiMap<FoveaHostConstructor, Function>}
 */
export const STATIC_CSS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, () => HTMLTemplateElement[]|undefined> = new WeakMultiMap();