/**
 * A Map between hashes and HTMLTemplateElements of parsing their styles
 * @type {Map<IFoveaHostConstructor|ICustomAttributeConstructor, HTMLTemplateElement[]>}
 */
export const HASH_TO_CSS_TEMPLATES: Map<string, HTMLTemplateElement[]> = new Map();