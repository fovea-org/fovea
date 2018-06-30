import postcss, {AtRule, Comment, Declaration, Node, Root, Rule, Transformer} from "postcss";
import {containsExpression, Json, splitByExpressions, takeInnerExpression} from "@fovea/common";
import {IPostCSSFoveaScssPreparePluginOptions} from "./i-postcss-fovea-scss-prepare-plugin-options";
import {IPostCSSFoveaScssPreparePluginContext} from "./i-postcss-fovea-scss-prepare-plugin-context";

export const SCSS_EXPRESSION_PREFIX = "SCSS_EXPRESSION_START_";
export const SCSS_EXPRESSION_SUFFIX = "_SCSS_EXPRESSION_END";
export const SCSS_REMOVE_ME_DECLARATION = "_SCSS_REMOVE_ME_";

/**
 * The name of the PostCSS plugin
 * @type {string}
 */
const name = "postcss-fovea-scss-prepare";

/**
 * The prefix to add before any declaration property value when working with scss files
 * @type {string}
 */
export const scssDeclarationValueExpressionPrefix = `var(--${SCSS_EXPRESSION_PREFIX}`;

/**
 * The suffix to add after any declaration property value when working with scss files
 * @type {string}
 */
export const scssDeclarationValueExpressionSuffix = `${SCSS_EXPRESSION_SUFFIX})`;

/**
 * A Plugin that can transform a .scss file with Fovea expressions into a representation that node-sass can work with
 * @type {postcss.Plugin<{}>}
 */
export const postCSSFoveaScssPreparePlugin = postcss.plugin(name, initializer);

/**
 * The initializer for the PostCSS expression parser plugin
 * @param {IPostcssTakeVariablesPreparePluginOptions} options
 * @returns {postcss.Transformer}
 */
function initializer (options?: Partial<IPostCSSFoveaScssPreparePluginOptions>): Transformer {
	return (css: Root) => {
		const normalizedOptions = normalizeContext(options);
		if (css.nodes == null) return;

		css.nodes.forEach(node => visit(node, normalizedOptions));
		normalizedOptions.deferredWork.forEach(work => work());
		// console.log(css.toString());
	};
}

/**
 * Invoked when a node is received
 * @param {Node} node
 * @param {IPostCSSFoveaScssPreparePluginContext} options
 */
function visit (node: Node, options: IPostCSSFoveaScssPreparePluginContext): void {

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
	}
}

/**
 * Invoked when a Rule is visited
 * @param {AtRule} node
 * @param {IPostCSSFoveaScssPreparePluginContext} options
 * @returns {boolean}
 */
function visitRule (node: Rule|AtRule, options: IPostCSSFoveaScssPreparePluginContext): void {

	// Visit all children of the rule
	if (node.nodes != null) {
		node.nodes.forEach(child => visit(child, options));
	}

	// Check if the value contains an expression
	const ruleContainsExpression = nodeContainsExpression(node, false);

	// If the declaration contains an expression, transform it into something that node-sass can work with
	if (ruleContainsExpression) {
		const text = node.type === "rule" ? node.selector : node.params;

		// Convert all of the expressions within the selector
		const splitted = splitByExpressions(text);
		const whitespaceRegex = /\s+/;
		const hasOnlyExpressions = splitted.every(part => containsExpression(part) || whitespaceRegex.test(part));
		const converted = splitted
			.map(part => containsExpression(part) ? `${SCSS_EXPRESSION_PREFIX}${takeInnerExpression(part)}${SCSS_EXPRESSION_SUFFIX}` : part)
			.join("");

		options.deferredWork.add(() => {
			const replacement = hasOnlyExpressions ? SCSS_REMOVE_ME_DECLARATION + converted : converted;
			if (node.type === "rule") node.selector = replacement;
			else node.params = replacement;
		});
	}
}

/**
 * Invoked when a Declaration is visited
 * @param {Declaration} node
 * @param {IPostCSSFoveaScssPreparePluginContext} options
 */
function visitDeclaration (node: Declaration, {deferredWork}: IPostCSSFoveaScssPreparePluginContext): void {

	// Check if the value contains an expression
	const declarationContainsExpression = nodeContainsExpression(node);

	// If the declaration contains an expression, transform it into something that node-sass can work with
	if (declarationContainsExpression) {

		// Convert all of the expressions within the selector
		const splitted = splitByExpressions(node.value);
		const converted = splitted
			.map(part => containsExpression(part) ? `${scssDeclarationValueExpressionPrefix}#{"${takeInnerExpression(node.value)}"}${scssDeclarationValueExpressionSuffix}` : part)
			.join("");

		deferredWork.add(() => node.replaceWith(<Json>`${node.prop}: ${converted}`));
	}
}

/**
 * Invoked when a Comment is visited
 * @param {Node} _node
 * @param {IPostcssTakeVariablesPreparePluginContext} _options
 * @returns {boolean}
 */
function visitComment (_node: Comment, _options: IPostCSSFoveaScssPreparePluginContext): void {
}

/**
 * Invoked when an Expression is visited
 * @param {Node} node
 * @param {IPostCSSFoveaScssPreparePluginContext} options
 * @returns {boolean}
 */
function visitExpression (node: Node, options: IPostCSSFoveaScssPreparePluginContext): void {
	const text = (<Json>node).text;

	// Convert all of the expressions within the expressions
	const splitted = splitByExpressions(text);
	const converted = splitted
		.map(part => containsExpression(part) ? `/*${SCSS_EXPRESSION_PREFIX}${takeInnerExpression(part)}${SCSS_EXPRESSION_SUFFIX}*/` : part)
		.join("");

	options.deferredWork.add(() => (<Json>node).text = converted);
}

/**
 * Normalizes the options provided to the plugin
 * @param {Partial<IPostCSSFoveaScssPreparePluginOptions>} _options
 * @returns {IPostCSSFoveaScssPreparePluginContext}
 */
function normalizeContext (_options: Partial<IPostCSSFoveaScssPreparePluginOptions> = {}): IPostCSSFoveaScssPreparePluginContext {
	return {
		deferredWork: new Set()
	};
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
			if (containsExpression(node.params)) return true;
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