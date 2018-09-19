import postcss, {AtRule, decl, Declaration, Node, Root, Rule, rule, Transformer} from "postcss";
import {IPostcssTakeVariablesPreparePluginOptions} from "./i-postcss-take-variables-prepare-plugin-options";
import {IPostcssTakeVariablesPreparePluginContext} from "./i-postcss-take-variables-prepare-plugin-context";
import {containsVariableReference, cssCustomPropertyPrefix, escapeValue, isCSSCustomProperty, isCustomProperty, isScssVariable, replaceVariableReferences, SCSS_TEMPORARY_PREFIX, SCSS_VARIABLE_REWRITE_PREFIX, scssVariablePrefix} from "../util";

/**
 * The name of the PostCSS plugin
 * @type {string}
 */
const name = "postcss-take-variables-prepare-plugin";


/**
 * A Plugin that can take all variables (SCSS variables and CSS Custom variables) from the given CSS or SCSS
 * @type {postcss.Plugin<{}>}
 */
export const postCSSTakeVariablesPreparePlugin = postcss.plugin(name, initializer);

/**
 * The initializer for the PostCSS take variables plugin
 * @param {IPostcssTakeVariablesPreparePluginOptions} options
 * @returns {Transformer}
 */
function initializer (options?: Partial<IPostcssTakeVariablesPreparePluginOptions>): Transformer {
	return (css: Root) => {
		const normalizedOptions = normalizeContext(options);
		if (css.nodes == null) return;

		// First collect variables from each of the nodes
		css.nodes.forEach(node => collect(node, normalizedOptions));

		// Now, run through the AST again but replace everything with primitive values
		css.nodes.forEach(node => visit(node, normalizedOptions));

		// Invoke each lazy worker
		normalizedOptions.lazyWorkers.forEach(lazyWorker => lazyWorker(css));
	};
}

/**
 * Invoked when a node is received
 * @param {Node} node
 * @param {IPostcssTakeVariablesPreparePluginContext} options
 * @returns {boolean}
 */
function visit (node: Node, options: IPostcssTakeVariablesPreparePluginContext): void {

	switch (node.type) {

		case "rule":
		case "atrule":
			return visitRule(node, options);

		case "decl":
			return visitDeclaration(node, options);
	}
}

/**
 * Invoked when a node is received during collection.
 * @param {Node} node
 * @param {IPostcssTakeVariablesPreparePluginContext} options
 * @returns {boolean}
 */
function collect (node: Node, options: IPostcssTakeVariablesPreparePluginContext): void {

	switch (node.type) {

		case "rule":
		case "atrule":
			return collectRule(node, options);

		case "decl":
			return collectDeclaration(node, options);
	}
}

/**
 * Invoked when a Rule is visited
 * @param {AtRule} node
 * @param {IPostcssTakeVariablesPreparePluginContext} options
 */
function visitRule (node: Rule|AtRule, options: IPostcssTakeVariablesPreparePluginContext): void {

	// Visit all children of the rule
	if (node.nodes != null) {

		// Walk through each of the child nodes
		node.nodes.forEach(child => visit(child, options));
	}
}

/**
 * Invoked when a Rule is visited during collection
 * @param {AtRule} node
 * @param {IPostcssTakeVariablesPreparePluginContext} options
 */
function collectRule (node: Rule|AtRule, options: IPostcssTakeVariablesPreparePluginContext): void {

	// Collect from all children of the rule
	if (node.nodes != null) {

		// Walk through each of the child nodes
		node.nodes.forEach(child => collect(child, options));
	}
}

/**
 * Invoked when a Declaration is visited during collection
 * @param {Declaration} node
 * @param {object} variables
 * @returns {void}
 */
function collectDeclaration (node: Declaration, {variables}: IPostcssTakeVariablesPreparePluginContext): void {
	// If it is a custom property, add it to the root and clone it as a SCSS variable
	if (isCustomProperty(node.prop)) {
		variables[isCSSCustomProperty(node.prop) ? `var(${node.prop})` : node.prop] = node.value;
	}
}

/**
 * Invoked when a Declaration is visited
 * @param {Declaration} node
 * @param {boolean} isScss
 * @param {LazyRootNodeWorker} lazyWorkers
 * @param {object} variables
 * @returns {void}
 */
function visitDeclaration (node: Declaration, {isScss, lazyWorkers, variables}: IPostcssTakeVariablesPreparePluginContext): void {

	// If we're in a raw CSS file, simply replace the value with its' variable references
	if (!isScss && containsVariableReference(node.value)) {
		lazyWorkers.push(() => node.replaceWith(decl({
			prop: node.prop,
			value: replaceVariableReferences(node.prop, node.value, variables)
		})));
	}

	// If it is a custom property, duplicate it as a SCSS variable but then alter the node to instead reference the SCSS variable
	if (isScss && isCSSCustomProperty(node.prop)) {
		const scssPropName = `${scssVariablePrefix}${SCSS_TEMPORARY_PREFIX}${node.prop.slice(cssCustomPropertyPrefix.length)}`;

		// Make sure to add a cloned SCSS variable to the root
		lazyWorkers.push(root => root.append(decl({
			prop: scssPropName,
			value: replaceVariableReferences(node.prop, node.value, variables)
		})));

		// Replace the node with one that simply references the SCSS prop
		lazyWorkers.push(root => {
			root.append(rule({
				selector: ":host",
				nodes: [decl({
					prop: node.prop,
					value: escapeValue(scssPropName)
				})]
			}));
			node.remove();
		});
	}

	// If this is a SCSS file and the property is a SCSS variable, and it is located within the root (e.g. not nested inside something else), keep it, but also add a CSS custom property that references it (otherwise it will be removed during compilation)
	else if (isScss && isScssVariable(node.prop) && node.parent.type === "root") {

		if (containsVariableReference(node.value)) {
			lazyWorkers.push(() => {
				node.replaceWith(decl({
					prop: node.prop,
					value: replaceVariableReferences(node.prop, node.value, variables)
				}));
			});
		}

		// Make sure to give the custom property a name that we know to be temporarily renamed
		const cssCustomPropertyName = SCSS_VARIABLE_REWRITE_PREFIX + node.prop.slice(scssVariablePrefix.length);

		// Create the declaration for the CSS custom property. It should simply reference the SCSS variable
		const cssCustomPropertyDeclaration = decl({prop: cssCustomPropertyName, value: escapeValue(node.prop)});

		// Make sure to add a cloned SCSS variable to the root
		lazyWorkers.push(root => root.append(rule({
			selector: ":host",
			nodes: [cssCustomPropertyDeclaration]
		})));
	}
}

/**
 * Normalizes the options provided to the plugin
 * @param {Partial<IPostcssTakeVariablesPreparePluginOptions>} options
 * @returns {IPostcssTakeVariablesPreparePluginContext}
 */
function normalizeContext (options: Partial<IPostcssTakeVariablesPreparePluginContext> = {}): IPostcssTakeVariablesPreparePluginContext {
	return {
		isScss: false,
		variables: {},
		lazyWorkers: [],
		...options
	};
}