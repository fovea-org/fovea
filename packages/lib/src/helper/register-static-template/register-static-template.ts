import {TemplateNode} from "../../template/node/template-node";
import {addStaticTemplate} from "../../template/static-template/add-static-template";

/**
 * Registers a template and maps it to the given identifier
 * @param {() => TemplateNode[]} templateFunction
 * @param {string} identifier
 * @private
 */
export function ___registerStaticTemplate (templateFunction: () => TemplateNode[], identifier: string): void {
	// For now, just invoke it immediately
	addStaticTemplate(templateFunction(), identifier);
}