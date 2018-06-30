import postcss, {AtRule, Comment, Declaration, Node, Root, Rule, Transformer, decl, comment} from "postcss";
import {EXPRESSION_QUALIFIER_BRACKET_START, EXPRESSION_QUALIFIER_DOLLAR_SIGN_START, EXPRESSION_QUALIFIER_END} from "@fovea/common";
import {IPostCSSFoveaScssCleanupPluginOptions} from "./i-postcss-fovea-scss-cleanup-plugin-options";
import {IPostCSSFoveaScssCleanupPluginContext} from "./i-postcss-fovea-scss-cleanup-plugin-context";
import {SCSS_EXPRESSION_PREFIX, SCSS_EXPRESSION_SUFFIX, SCSS_REMOVE_ME_DECLARATION, scssDeclarationValueExpressionPrefix, scssDeclarationValueExpressionSuffix} from "../postcss-fovea-scss-prepare-plugin/postcss-fovea-scss-prepare-plugin";

/**
 * The name of the PostCSS plugin
 * @type {string}
 */
const name = "postcss-fovea-scss-cleanup";

/**
 * A Plugin that can transform a .scss file with Fovea expressions into a representation that node-sass can work with
 * @type {postcss.Plugin<{}>}
 */
export const postCSSFoveaScssCleanupPlugin = postcss.plugin(name, initializer);

/**
 * The initializer for the PostCSS expression parser plugin
 * @param {IPostcssTakeVariablesPreparePluginOptions} options
 * @returns {postcss.Transformer}
 */
function initializer (options?: Partial<IPostCSSFoveaScssCleanupPluginOptions>): Transformer {
	return (css: Root) => {
		const normalizedOptions = normalizeContext(options);
		if (css.nodes == null) return;

		css.nodes.forEach(node => visit(node, normalizedOptions));
		normalizedOptions.deferredWork.forEach(work => work());
	};
}

/**
 * Invoked when a node is received
 * @param {Node} node
 * @param {IPostCSSFoveaScssCleanupPluginContext} options
 */
function visit (node: Node, options: IPostCSSFoveaScssCleanupPluginContext): void {

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
 * @param {IPostCSSFoveaScssCleanupPluginContext} options
 * @returns {boolean}
 */
function visitRule (node: Rule|AtRule, options: IPostCSSFoveaScssCleanupPluginContext): void {

	// Check if the value contains an expression
	const ruleContainsPreparedExpression = nodeContainsPreparedExpression(node);

	// If the declaration contains an expression, transform it into something that node-sass can work with
	if (ruleContainsPreparedExpression) {
		options.deferredWork.add(() => {
			node.type === "rule" ? node.selector = revertExpression(node.selector) : node.params = revertExpression(node.params);
		});
	}

	// Visit all children of the rule
	if (node.nodes != null) {
		node.nodes.forEach(child => visit(child, options));
	}
}

/**
 * Invoked when a Declaration is visited
 * @param {Declaration} node
 * @param {IPostCSSFoveaScssCleanupPluginContext} options
 */
function visitDeclaration (node: Declaration, {deferredWork}: IPostCSSFoveaScssCleanupPluginContext): void {

	// Check if the value contains an expression
	const declarationContainsPreparedExpression = nodeContainsPreparedExpression(node);

	// If the declaration contains an expression, transform it into something that node-sass can work with
	if (declarationContainsPreparedExpression) {
		deferredWork.add(() => node.replaceWith(decl({
			prop: node.prop,
			value: revertExpression(node.value)
		})));
	}
}

/**
 * Invoked when a Comment is visited
 * @param {Node} node
 * @param {IPostcssTakeVariablesPreparePluginContext} options
 * @returns {boolean}
 */
function visitComment (node: Comment, {deferredWork}: IPostCSSFoveaScssCleanupPluginContext): void {
	// Check if the comment contains an expression
	const commentContainsPreparedExpression = nodeContainsPreparedExpression(node);

	// If the declaration contains an expression, transform it into something that node-sass can work with
	if (commentContainsPreparedExpression) {
		deferredWork.add(() => node.replaceWith(comment({
			text: revertExpression(node.text)
		})));
	}
}

/**
 * Invoked when an Expression is visited
 * @param {Node} _node
 * @param {IPostCSSFoveaScssCleanupPluginContext} _options
 * @returns {boolean}
 */
function visitExpression (_node: Node, _options: IPostCSSFoveaScssCleanupPluginContext): void {
}

/**
 * Normalizes the options provided to the plugin
 * @param {Partial<IPostCSSFoveaScssCleanupPluginOptions>} _options
 * @returns {IPostCSSFoveaScssCleanupPluginContext}
 */
function normalizeContext (_options: Partial<IPostCSSFoveaScssCleanupPluginOptions> = {}): IPostCSSFoveaScssCleanupPluginContext {
	return {
		deferredWork: new Set()
	};
}

/**
 * Returns true if the given node contains an expression
 * @param {postcss.Rule | postcss.AtRule} node
 * @returns {boolean}
 */
function nodeContainsPreparedExpression (node: Node): boolean {
	switch (node.type) {

		case "decl":
			return node.value.includes(scssDeclarationValueExpressionPrefix) || node.prop.includes(scssDeclarationValueExpressionPrefix);

		case "rule":
		case "atrule":
			const ruleText = node.type === "rule" ? node.selector : node.params;
			return (ruleText.includes(SCSS_EXPRESSION_PREFIX) && ruleText.includes(SCSS_EXPRESSION_SUFFIX)) || ruleText.includes(SCSS_REMOVE_ME_DECLARATION);

		case <"decl">"expression":
			return true;

		case "comment":
			return (node.text.includes(SCSS_EXPRESSION_PREFIX) && node.text.includes(SCSS_EXPRESSION_SUFFIX)) || node.text.includes(SCSS_REMOVE_ME_DECLARATION);

		default:

			// Default to false
			return false;
	}
}

/**
 * Takes the inner prepared expression
 * @param {string} str
 * @returns {string}
 */
function revertExpression (str: string): string {
	return str
		.replace(new RegExp(SCSS_REMOVE_ME_DECLARATION, "g"), "")
		.replace(new RegExp(`${escapeRegexInitString(scssDeclarationValueExpressionPrefix)}(.*)${escapeRegexInitString(scssDeclarationValueExpressionSuffix)}`, "g"), (_, p1) => {
			return `${EXPRESSION_QUALIFIER_DOLLAR_SIGN_START}${EXPRESSION_QUALIFIER_BRACKET_START}${p1}${EXPRESSION_QUALIFIER_END}`;
		})
		.replace(new RegExp(`(\\/\\*)*${SCSS_EXPRESSION_PREFIX}(.*)${SCSS_EXPRESSION_SUFFIX}(\\*\\/)*`, "g"), (_, _1, p2) => {
			return `${EXPRESSION_QUALIFIER_DOLLAR_SIGN_START}${EXPRESSION_QUALIFIER_BRACKET_START}${p2}${EXPRESSION_QUALIFIER_END}`;
		});
}

/**
 * Double-escapes characters provided to the RegExp constructor
 * @param {string} str
 * @returns {string}
 */
function escapeRegexInitString (str: string): string {
	return str
		.replace(/\(/g, "\\(")
		.replace(/\)/g, "\\)");
}