import {TemplateNode} from "../node/template-node";

/**
 * A Map between hashes and their TemplateNodes
 * @type {Map<IFoveaHostConstructor|ICustomAttributeConstructor, TemplateNode[][]>}
 */
export const HASH_TO_TEMPLATES: Map<string, TemplateNode[][]> = new Map();