import postcss, {AtRule, Comment, Declaration, Node, Root, Rule, Transformer} from "postcss";
import {containsExpression} from "@fovea/common";
import {IPostCSSFoveaPluginOptions} from "./i-postcss-fovea-plugin-options";
import {IPostCSSFoveaPluginContext} from "./i-postcss-fovea-plugin-context";

/**
 * The name of the PostCSS plugin
 * @type {string}
 */
const name = "postcss-fovea-plugin";

/**
 * A Plugin that can parse expressions within CSS
 * @type {postcss.Plugin<{}>}
 */
export const postCSSFoveaPlugin = postcss.plugin(name, initializer);

/**
 * The initializer for the PostCSS expression parser plugin
 * @param {IPostCSSFoveaPluginOptions} options
 * @returns {postcss.Transformer}
 */
function initializer (options?: Partial<IPostCSSFoveaPluginOptions>): Transformer {
	return (css: Root) => {
		const normalizedOptions = normalizeContext(options);
		if (css.nodes == null) return;

		const removeNodes = css.nodes.filter(node => visit(node, normalizedOptions));
		removeNodes.forEach(node => node.remove());
	};
}

/**
 * Invoked when a node is received
 * @param {Node} node
 * @param {IPostCSSFoveaPluginContext} options
 * @returns {boolean}
 */
function visit (node: Node, options: IPostCSSFoveaPluginContext): boolean {

	switch (node.type) {

		case "rule":
		case "atrule":
			return visitRule(node, options);

		case "comment":
			return visitComment(node, options);

		case <"decl">"expression":
			return visitExpression(node, options);

		case "decl":
			return visitDeclaration(node, options);

		default:
			// Default to false
			return false;
	}
}

/**
 * Invoked when a Rule is visited
 * @param {AtRule} node
 * @param {IPostCSSFoveaPluginContext} options
 * @returns {boolean}
 */
function visitRule (node: Rule|AtRule, options: IPostCSSFoveaPluginContext): boolean {

	// Visit all children of the rule
	if (node.nodes != null) {

		// Check which of the nodes should be removed
		const removeNodes = node.nodes.filter(child => visit(child, options));
		removeNodes.forEach(removeNode => removeNode.remove());
	}

	// Check if the rule selector or name contains an expression
	const ruleContainsExpression = nodeContainsExpression(node);
	const isChildOfExpression = nodeIsChildOfExpressionNode(node);

	// Check if the rule is now empty
	const isEmpty = ruleIsEmpty(node);

	switch (options.mode) {
		case "static":
			// Remove the node if the value is an expression
			return ruleContainsExpression || isEmpty;

		case "instance":
			return !ruleContainsExpression && !isChildOfExpression;
	}
}

/**
 * Invoked when a Declaration is visited
 * @param {Declaration} node
 * @param {IPostCSSFoveaPluginContext} options
 * @returns {boolean}
 */
function visitDeclaration (node: Declaration, {mode}: IPostCSSFoveaPluginContext): boolean {

	// Check if the value contains an expression
	const declarationContainsExpression = nodeContainsExpression(node);
	const isChildOfExpression = nodeIsChildOfExpressionNode(node);

	switch (mode) {
		case "static":
			// Remove the node if the value is an expression
			return declarationContainsExpression;

		case "instance":
			// Remove the node if the value is NOT an expression and it isn't a child of an expression node
			return !declarationContainsExpression && !isChildOfExpression;
	}
}

/**
 * Invoked when a Comment is visited
 * @param {Node} _node
 * @param {IPostCSSFoveaPluginContext} _options
 * @returns {boolean}
 */
function visitComment (_node: Comment, _options: IPostCSSFoveaPluginContext): boolean {
	return true;
}

/**
 * Invoked when an Expression is visited
 * @param {Node} _node
 * @param {IPostCSSFoveaPluginContext} options
 * @returns {boolean}
 */
function visitExpression (_node: Node, {mode}: IPostCSSFoveaPluginOptions): boolean {

	switch (mode) {
		// If only static styles are accepted, remove expressions entirely
		case "static":
			return true;
		case "instance":
			return false;
	}
}

/**
 * Returns true if the given rule is empty - or if it only includes comments
 * @param {Rule|AtRule} rule
 * @returns {boolean}
 */
function ruleIsEmpty (rule: Rule|AtRule): boolean {
	if (rule.nodes == null || rule.nodes.length < 1) return true;
	return rule.nodes.every(node => node.type === "comment");
}

/**
 * Normalizes the options provided to the plugin
 * @param {Partial<IPostCSSFoveaPluginOptions>} options
 * @returns {IPostCSSFoveaPluginContext}
 */
function normalizeContext (options: Partial<IPostCSSFoveaPluginContext> = {}): IPostCSSFoveaPluginContext {
	return {
		mode: options.mode == null ? "static" : options.mode
	};
}

/**
 * Returns true if the node has any parent that contains an expression
 * @param {Node} node
 * @returns {boolean}
 */
function nodeIsChildOfExpressionNode (node: Node): boolean {
	let parent = node.parent;
	while (parent != null) {
		const hasExpression = nodeContainsExpression(parent, false);
		if (hasExpression) return true;
		parent = parent.parent;
	}
	return false;
}

/**
 * Returns true if the given node contains an expression
 * @param {postcss.Rule | postcss.AtRule} node
 * @param {boolean} [traverse=true]
 * @returns {boolean}
 */
function nodeContainsExpression (node: Node, traverse: boolean = true): boolean {
	switch (node.type) {
		case "rule":

			// If the selector includes an expression, return true
			if (containsExpression(node.selector)) return true;

			// Otherwise, if it has no children, return false
			if (node.nodes == null || node.nodes.length === 0) return false;

			// Otherwise, return true if any of its' children contains an expression
			return traverse ? node.nodes.some(child => nodeContainsExpression(child)) : false;

		case "atrule":

			// If the name includes an expression, return true
			if (containsExpression(node.name)) return true;
			// Otherwise, if it has no children, return false

			if (node.nodes == null || node.nodes.length === 0) return false;

			// Otherwise, return true if any of its' children contains an expression
			return traverse ? node.nodes.some(child => nodeContainsExpression(child)) : false;

		case "decl":

			return containsExpression(node.value) || containsExpression(node.prop);

		case <"decl">"expression":
			return true;

		default:

			// Default to false
			return false;
	}
}