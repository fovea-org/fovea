import postcss, {AtRule, Declaration, Node, Result, Root, Rule, Transformer} from "postcss";
import {IPostcssTakeVariablesPluginOptions} from "./i-postcss-take-variables-plugin-options";
import {IPostcssTakeVariablesPluginContext} from "./i-postcss-take-variables-plugin-context";
import {SCSS_TEMPORARY_PREFIX, SCSS_VARIABLE_REWRITE_PREFIX} from "../postcss-take-variables-prepare-plugin/postcss-take-variables-prepare-plugin";

/**
 * The name of the PostCSS plugin
 * @type {string}
 */
const name = "postcss-take-variables-plugin";

/**
 * A Regular Expression to match SCSS variables and/or CSS custom variables
 * @type {RegExp}
 */
const variableRegex = /^\$|^--/;

/**
 * A Plugin that can take all variables (SCSS variables and CSS Custom variables) from the given CSS or SCSS
 * @type {postcss.Plugin<{}>}
 */
export const postCSSTakeVariablesPlugin = postcss.plugin(name, initializer);

/**
 * The initializer for the PostCSS take variables plugin
 * @param {IPostcssTakeVariablesPluginOptions} options
 * @returns {Transformer}
 */
function initializer (options?: Partial<IPostcssTakeVariablesPluginOptions>): Transformer {
	return (css: Root, result: Result) => {
		const normalizedOptions = normalizeContext(options);
		if (css.nodes == null) return;

		css.nodes.forEach(node => visit(node, normalizedOptions));

		// Write the variables to the result as a warning (this will be our way of returning meaningful content)
		result.warn(JSON.stringify(normalizedOptions.variables));
	};
}

/**
 * Invoked when a node is received
 * @param {Node} node
 * @param {IPostcssTakeVariablesPluginContext} options
 * @returns {boolean}
 */
function visit (node: Node, options: IPostcssTakeVariablesPluginContext): void {

	switch (node.type) {

		case "rule":
		case "atrule":
			return visitRule(node, options);

		case "decl":
			return visitDeclaration(node, options);
	}
}

/**
 * Invoked when a Rule is visited
 * @param {AtRule} node
 * @param {IPostcssTakeVariablesPluginContext} options
 */
function visitRule (node: Rule|AtRule, options: IPostcssTakeVariablesPluginContext): void {

	// Visit all children of the rule
	if (node.nodes != null) {

		// Walk through each of the child nodes
		node.nodes.forEach(child => visit(child, options));
	}
}

/**
 * Invoked when a Declaration is visited
 * @param {Declaration} node
 * @param {object} variables
 * @returns {void}
 */
function visitDeclaration (node: Declaration, {variables}: IPostcssTakeVariablesPluginContext): void {
	if (isVariable(node.prop) && !isTemporaryScssVariable(node.prop)) {
		const prop = isRewrittenScssVariable(node.prop) ? `$${node.prop.slice(SCSS_VARIABLE_REWRITE_PREFIX.length)}` : node.prop;
		variables[prop] = node.value;
	}
}

/**
 * Normalizes the options provided to the plugin
 * @param {Partial<IPostcssTakeVariablesPluginOptions>} options
 * @returns {IPostcssTakeVariablesPluginContext}
 */
function normalizeContext ({}: Partial<IPostcssTakeVariablesPluginContext> = {}): IPostcssTakeVariablesPluginContext {
	return {
		variables: {}
	};
}

/**
 * Returns true if the given property is a variable declaration
 * @param {string} property
 * @returns {boolean}
 */
function isVariable (property: string): boolean {
	return variableRegex.test(property);
}

/**
 * Returns true if the given property is a rewritten SCSS variable
 * @param {string} property
 * @returns {boolean}
 */
function isRewrittenScssVariable (property: string): boolean {
	return property.includes(SCSS_VARIABLE_REWRITE_PREFIX);
}

/**
 * Returns true if the given property is a temporary SCSS variable
 * @param {string} property
 * @returns {boolean}
 */
function isTemporaryScssVariable (property: string): boolean {
	return property.includes(SCSS_TEMPORARY_PREFIX);
}