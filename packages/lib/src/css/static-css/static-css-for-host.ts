import {FoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Map between FoveaHostConstructors and functions that retrieve HTMLTemplateElements for all static CSS that should be appended to them
 * @type {WeakMultiMap<FoveaHostConstructor, Function>}
 */
export const STATIC_CSS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, () => HTMLTemplateElement[]|undefined> = new WeakMultiMap();