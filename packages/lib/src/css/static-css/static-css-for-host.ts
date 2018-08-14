import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";

/**
 * A Map between IFoveaHostConstructors and functions that retrieve HTMLTemplateElements for all static CSS that should be appended to them
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Function>}
 */
export const STATIC_CSS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, () => HTMLTemplateElement[]|undefined> = new WeakMultiMap();