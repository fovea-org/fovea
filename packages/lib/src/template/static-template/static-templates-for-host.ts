import {FoveaHostConstructor, WeakMultiMap} from "@fovea/common";
import {TemplateNode} from "../node/template-node";

/**
 * A Map between FoveaHostConstructors and functions that retrieve their TemplateNodes
 * @type {WeakMultiMap<FoveaHostConstructor, Function>}
 */
export const STATIC_TEMPLATES_FOR_HOST: WeakMultiMap<FoveaHostConstructor, () => TemplateNode[][]|undefined> = new WeakMultiMap();