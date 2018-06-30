import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {TemplateNode} from "../node/template-node";

/**
 * A Map between IFoveaHostConstructors and functions that retrieve their TemplateNodes
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, Function>}
 */
export const STATIC_TEMPLATES_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, () => TemplateNode[][]|undefined> = new WeakMultiMap();