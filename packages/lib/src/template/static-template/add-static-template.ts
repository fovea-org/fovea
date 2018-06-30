import {TemplateNode} from "../node/template-node";
import {HASH_TO_TEMPLATES} from "./hash-to-templates";

/**
 * Maps the given TemplateNodes to the given hash
 * @param {TemplateNode[]} nodes
 * @param {string} hash
 */
export function addStaticTemplate (nodes: TemplateNode[], hash: string): void {
	// Take the existing templates
	const existingTemplates = HASH_TO_TEMPLATES.get(hash);

	// If non exist, map the template nodes to the hash
	if (existingTemplates == null) {
		HASH_TO_TEMPLATES.set(hash, [nodes]);
	}

	// Otherwise, push the template nodes to the existing array of template nodes for the hash
	else {
		existingTemplates.push(nodes);
	}
}