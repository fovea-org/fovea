import {HASH_TO_CSS_TEMPLATES} from "./hash-to-css-templates";

/**
 * Generates a template element from the given css such that it can be cloned later on.
 * It maps it to the hash provided as the second argument
 * @param {string} css
 * @param {string} hash
 */
export function addStaticCSS (css: string, hash: string): void {
	// Add the static css to the static css for that host
	// Create a template
	const template = document.createElement("template");
	// Create a style tag
	const style = document.createElement("style");
	// Set the css as the text content of that style tag
	style.textContent = css;
	// Add it to the template
	template.content.appendChild(style);

	// Take the existing templates
	const existingTemplates = HASH_TO_CSS_TEMPLATES.get(hash);

	// If non exist, map the template to the hash
	if (existingTemplates == null) {
		HASH_TO_CSS_TEMPLATES.set(hash, [template]);
	}

	// Otherwise, push the template to the existing array of templates for the hash
	else {
		existingTemplates.push(template);
	}
}