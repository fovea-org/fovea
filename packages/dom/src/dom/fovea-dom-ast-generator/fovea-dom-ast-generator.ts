import {IFoveaDOMAstGenerator} from "./i-fovea-dom-ast-generator";
import {IFoveaDOMAstGeneratorOptions} from "./i-fovea-dom-ast-generator-options";
import {FoveaDOMAst, FoveaDOMAstElement, FoveaDOMAstKind, FoveaDOMAstNode, IFoveaDOMAstAttribute, IFoveaDOMAstCustomAttribute, IFoveaDOMAstListener, IFoveaDOMAstTextNode} from "../fovea-dom-ast/i-fovea-dom-ast";
import {DOMAstNodeRaw, DOMAstRaw, IDOMAstNodeRaw} from "../dom-ast-implementation/i-dom-ast-raw";
import {containsExpression, CUSTOM_ATTRIBUTE_QUALIFIER, EXPRESSION_FULL_QUALIFIER, HTML_TAG_NAMES, HtmlTagName, LISTENER_QUALIFIER, LISTENER_QUALIFIER_REGEX, Ref, REF_QUALIFIER, splitByExpressions, takeInnerExpression} from "@fovea/common";
import {IFoveaDOMAstGeneratorPartsResult} from "./i-fovea-dom-ast-generator-parts-result";
import {IExpressionUtil} from "../../util/expression-util/i-expression-util";
import {IFoveaDOMAstGeneratorGenerateResult} from "./i-fovea-dom-ast-generator-generate-result";
import {IContext} from "../../util/context-util/i-context";
import {IDOMUtil} from "../../util/dom-util/i-dom-util";
import {IKeyValueParser} from "../../service/key-value-parser/i-key-value-parser";
import {RawExpressionChainBindable} from "../../expression/raw-expression-chain-bindable/raw-expression-chain-bindable";
import {IRawExpressionChainBindableDict} from "../../expression/i-raw-expression-chain-bindable-dict/i-raw-expression-chain-bindable-dict";
import {removeWhitespace, isEmpty} from "@wessberg/stringutil";
/**
 * A class that can generate a raw AST into a FoveaDOMAst.
 */
export class FoveaDOMAstGenerator implements IFoveaDOMAstGenerator {
	/**
	 * A Regular Expression or matching HTML comments
	 * @type {RegExp}
	 */
	private static readonly HTML_COMMENT_REGEX = /<!--[\t\n\r]|.*-->/;

	/**
	 * A Regular Expression matching pure whitespace
	 * @type {RegExp}
	 */
	private static readonly REMOVABLE_WHITESPACE_NODE_REGEX = /^([\n\t]|\\n|\\t)+$/;

	/**
	 * A Regular Expression that will match any removable whitespace character from a string globally
	 * @type {RegExp}
	 */
	private static readonly REMOVABLE_WHITESPACE_CHARACTERS_REGEX = /\n|\\n|\t|\\t/g;

	constructor (private readonly keyValueParser: IKeyValueParser,
							 private readonly expressionUtil: IExpressionUtil,
							 private readonly domUtil: IDOMUtil) {
	}

	/**
	 * Generates a FoveaDOMAst from the provided options
	 * @param {DOMAstRaw} ast
	 * @param {IContext} context
	 * @returns {FoveaDOMAst}
	 */
	public generate ({ast, context}: IFoveaDOMAstGeneratorOptions): IFoveaDOMAstGeneratorGenerateResult {

		// Generate a FoveaDOMAst from it. Remove empty content before generating it.
		return this.convertFromRawAstToFoveaAst(this.filterRawAst(ast), context);
	}

	/**
	 * Stringifies the given AST RawNode
	 * @param {DOMAstNodeRaw} node
	 * @param {boolean} [onlyInnerContents=false]
	 * @returns {string}
	 */
	private stringifyAstRawNode (node: DOMAstNodeRaw, onlyInnerContents: boolean = false): string {
		if (typeof node === "string") return node;
		const {attrs, content, tag} = node;

		// Dont add the tag if only the inner contents should be taken
		let str = onlyInnerContents ? "" : `<${tag}`;

		// Don't add attributes if only the inner contents should be taken
		if (!onlyInnerContents) {
			if (attrs != null) {

				// Add all of the attributes
				Object.keys(attrs).forEach(key => {
					str += ` ${key}`;
					const value = attrs[key];
					if (value != null && value.length > 0) {
						str += `="${value}"`;
					}
				});
			}

			// End the tag
			str += ">";
		}

		if (content != null) {
			// Add in all of its content
			content.forEach(part => str += this.stringifyAstRawNode(part));
		}

		// Add the closing tag unless only the inner contents should be taken
		if (!onlyInnerContents) {
			str += `</${tag}>`;
		}
		return str;
	}

	/**
	 * Filters the raw ast to avoid empty nodes
	 * @param {DOMAstRaw} ast
	 * @param {boolean} [shouldSkipFilteringForParent=false]
	 * @returns {DOMAstRaw}
	 */
	private filterRawAst (ast: DOMAstRaw, shouldSkipFilteringForParent: boolean = false): DOMAstRaw {
		return ast
			.map(node => this.updatePrequalifiedRawAstNode(node, shouldSkipFilteringForParent))
			.filter(node => this.shouldIncludeNode(node, shouldSkipFilteringForParent));
	}

	/**
	 * Returns true if filtering should be skipped for the given node
	 * @param {DOMAstNodeRaw} node
	 * @returns {boolean}
	 */
	private shouldSkipFilteringForNode (node: DOMAstNodeRaw): boolean {
		return this.nodeIsIDOMAstNodeRaw(node) && this.domUtil.isPreserveFormattingNodeName(node.tag);
	}

	/**
	 * Returns true if filtering should be skipped for the given node
	 * @param {DOMAstNodeRaw} node
	 * @returns {boolean}
	 */
	private isSVGOrChildOfSVG (node: DOMAstNodeRaw): boolean {
		return this.nodeIsIDOMAstNodeRaw(node) && (node.svgOrChildOfSvg || node.tag === "svg");
	}

	/**
	 * Returns true if the given node should be included
	 * @param {DOMAstNodeRaw} node
	 * @param {boolean} shouldSkipFilteringForParent: boolean
	 * @returns {boolean}
	 */
	private shouldIncludeNode (node: DOMAstNodeRaw, shouldSkipFilteringForParent: boolean): boolean {
		return this.shouldSkipFilteringForNode(node) || shouldSkipFilteringForParent || !this.isNodeEmpty(node);
	}

	/**
	 * Sets the 'svgOrSvgChild' property on a node
	 * @param {DOMAstNodeRaw} node
	 * @returns {DOMAstNodeRaw}
	 */
	private setSvgOrSvgChildStatusForNode (node: DOMAstNodeRaw): DOMAstNodeRaw {
		// Do nothing for text nodes
		if (!this.nodeIsIDOMAstNodeRaw(node)) return node;

		// Check if the node is an SVG element or a child of an SVG element and set it on the node
		node.svgOrChildOfSvg = this.isSVGOrChildOfSVG(node);

		// Pass that on to all of its' children
		if (node.content != null) {
			node.content.forEach(child => {
				if (this.nodeIsIDOMAstNodeRaw(child)) {
					child.svgOrChildOfSvg = node.svgOrChildOfSvg;
				}
			});
		}
		return node;
	}

	/**
	 * Handles a node that has been prequalified for manipulation inside the generated raw AST
	 * @param {DOMAstNodeRaw} node
	 * @param {boolean} [shouldSkipFilteringForParent=false]
	 * @returns {DOMAstNodeRaw}
	 */
	private updatePrequalifiedRawAstNode (node: DOMAstNodeRaw, shouldSkipFilteringForParent: boolean = false): DOMAstNodeRaw {
		// Check if the node is an SVG element or the child of one and set it on the Node
		this.setSvgOrSvgChildStatusForNode(node);

		// Check if filtering should be skipped for the node
		const shouldSkipFilteringForNode = shouldSkipFilteringForParent || this.shouldSkipFilteringForNode(node);

		// If the node is a simply textContent, remove whitespace from it and return the result
		if (!shouldSkipFilteringForNode && !this.nodeIsIDOMAstNodeRaw(node)) return this.removeUnneededWhitespace(node);

		if (this.nodeIsIDOMAstNodeRaw(node) && node.content != null) {
			// Otherwise, do the same thing with the nodes' content, if it has some
			node.content = this.filterRawAst(node.content, shouldSkipFilteringForNode);
		}

		// Fall back to simply returning the node
		return node;

	}

	/**
	 * Returns true if the given node is an IDOMAstNodeRaw
	 * @param {string | IDOMAstNodeRaw} node
	 * @returns {boolean}
	 */
	private nodeIsIDOMAstNodeRaw (node: string|IDOMAstNodeRaw): node is IDOMAstNodeRaw {
		return typeof node !== "string";
	}

	/**
	 * Returns true if the given node is empty
	 * @param {DOMAstNodeRaw} node
	 * @returns {boolean}
	 */
	private isNodeEmpty (node: DOMAstNodeRaw): boolean {
		return this.isHTMLComment(node) || this.isRemovableWhitespace(node);
	}

	/**
	 * Removes unneeded whitespace from the provided string
	 * @param {string} node
	 * @returns {string}
	 */
	private removeUnneededWhitespace (node: string): string {
		return removeWhitespace(node, true)
			.replace(FoveaDOMAstGenerator.REMOVABLE_WHITESPACE_CHARACTERS_REGEX, "");
	}

	/**
	 * Returns true if the node only contains whitespace that can be safely removed
	 * @param {DOMAstNodeRaw} node
	 * @returns {boolean}
	 */
	private isRemovableWhitespace (node: DOMAstNodeRaw): boolean {
		if (typeof node !== "string") return false;
		return FoveaDOMAstGenerator.REMOVABLE_WHITESPACE_NODE_REGEX.test(node);
	}

	/**
	 * Returns true if the given node reflects an HTMLComment
	 * @param {DOMAstNodeRaw} node
	 * @returns {boolean}
	 */
	private isHTMLComment (node: DOMAstNodeRaw) {
		if (typeof node !== "string") return false;
		return isEmpty(node) || FoveaDOMAstGenerator.HTML_COMMENT_REGEX.test(node);
	}

	/**
	 * Converts the generated raw ast into another one that FoveaDOMHost expects to work with.
	 * @param {DOMAstRaw} ast
	 * @param {IContext} context
	 * @param {number} [depth=0]
	 * @param {boolean} [insidePreserveFormattingNode=false]
	 * @param {FoveaDOMAstNode?} [parent]
	 * @returns {FoveaDOMAst}
	 */
	private convertFromRawAstToFoveaAst (ast: DOMAstRaw, context: IContext, depth: number = 0, insidePreserveFormattingNode: boolean = false, parent?: FoveaDOMAstNode): IFoveaDOMAstGeneratorGenerateResult {
		const foveaAst: FoveaDOMAst = [];
		ast.forEach(node => {
			const parentNode = parent;
			const isRootNode = depth === 0;

			// If the node is a string, it is a text node
			if (typeof node === "string") {
				// Add them to the AST
				foveaAst.push(...this.convertStringNodeToFoveaDOMAstTextNodes(node, insidePreserveFormattingNode, parentNode, isRootNode, context));
			}

			// Otherwise, it is a proper ast node
			else {

				// Add it to the AST
				const element = this.convertRawNodeToFoveaDOMAstElement(node, insidePreserveFormattingNode, parentNode, isRootNode, depth, context);
				insidePreserveFormattingNode && !((<keyof HTMLElementTagNameMap> node.tag).toLowerCase() === "code" || (<keyof HTMLElementTagNameMap>node.tag).toLowerCase() === "samp")
					? foveaAst.push(...this.convertStringNodeToFoveaDOMAstTextNodes(element.toString(), insidePreserveFormattingNode, parentNode, isRootNode, context))
					: foveaAst.push(element);
			}
		});

		// Return the generated ASt
		return {ast: foveaAst};
	}

	/**
	 * Converts a raw AST node into a proper FoveaDOMAstElement
	 * @param {IDOMAstNodeRaw} node
	 * @param {boolean} insidePreserveFormattingNode
	 * @param {FoveaDOMAstNode?} parentNode
	 * @param {boolean} isRootNode
	 * @param {number} depth
	 * @param {IContext} context
	 * @returns {FoveaDOMAstElement}
	 */
	private convertRawNodeToFoveaDOMAstElement (node: IDOMAstNodeRaw, insidePreserveFormattingNode: boolean, parentNode: FoveaDOMAstNode|undefined, isRootNode: boolean, depth: number, context: IContext): FoveaDOMAstElement {
		// Get the type of the node
		const type = this.getFoveaDOMAstKind(node);

		// Make sure we have an array of attributes to work with
		const rawAttributes = node.attrs == null ? [] : Object.entries(node.attrs);

		// Map them into Fovea-relevant parts
		const {attributes, listeners, customAttributes, ref} = this.divideRawAttributesIntoFoveaElementParts(rawAttributes, context);

		// Prepare the FoveaDOMAstElement.
		const foveaDomAstNode: FoveaDOMAstElement = {
			type: </*tslint:disable*/any/*tslint:enable*/>type,
			name: node.tag,
			ref,
			parentNode,
			isRootNode,
			attributes,
			customAttributes,
			listeners,
			children: [],
			stringify: (onlyInnerContent: boolean = false) => this.stringifyAstRawNode(node, onlyInnerContent),
			toString: () => this.stringifyAstRawNode(node)
		};

		// Check if we're inside a noe where formatting should be preserved (e.g. expressions should be escaped)
		insidePreserveFormattingNode = insidePreserveFormattingNode || this.domUtil.isPreserveFormattingNodeName(node.tag);

		// Recursively add the children.
		foveaDomAstNode.children = node.content == null ? [] : this.convertFromRawAstToFoveaAst(node.content, context, depth + 1, insidePreserveFormattingNode, foveaDomAstNode).ast;
		return foveaDomAstNode;
	}

	/**
	 * Takes some raw attributes and creates Fovea-relevant parts from them
	 * @param {[string,string][]} rawAttributes
	 * @param {IContext} context
	 * @returns {IFoveaDOMAstGeneratorPartsResult}
	 */
	private divideRawAttributesIntoFoveaElementParts (rawAttributes: [string, string][], context: IContext): IFoveaDOMAstGeneratorPartsResult {
		const attributes: IFoveaDOMAstAttribute[] = [];
		const customAttributes: IFoveaDOMAstCustomAttribute[] = [];
		const listeners: IFoveaDOMAstListener[] = [];
		let ref: Ref|null = null;

		// Loop through each part and divide it into the kind it is relevant to
		rawAttributes.forEach(entry => {
			const [key, value] = entry;

			// We're having to do with a custom attribute
			if (key.startsWith(CUSTOM_ATTRIBUTE_QUALIFIER)) {
				// Take the key from immediately after the qualifier for the custom attribute
				context.hasTemplateCustomAttributes = true;
				customAttributes.push(
					this.mapRawEntryToFoveaDOMAttribute([key.slice(CUSTOM_ATTRIBUTE_QUALIFIER.length), value], context, true)
				);
			}

			// We're having to do with a listener
			else if (LISTENER_QUALIFIER_REGEX.test(key)) {
				context.hasTemplateListeners = true;
				listeners.push(this.mapRawEntryToFoveaDOMListener(entry, context));
			}

			// We're having to do with a listener
			else if (key.startsWith(REF_QUALIFIER)) {
				context.hasTemplateRefs = true;
				// Take everything beside the initial '#' and make it the Ref.
				ref = key.slice(REF_QUALIFIER.length);
			}

			// Otherwise, treat it as an attribute
			else {
				context.hasTemplateAttributes = true;
				attributes.push(
					this.mapRawEntryToFoveaDOMAttribute(entry, context, false)
				);
			}
		});
		return {
			customAttributes,
			attributes,
			listeners,
			ref
		};
	}

	/**
	 * Converts a string to a FoveaDOMAstTextNode
	 * @param {string} node
	 * @param {boolean} insidePreserveFormattingNode
	 * @param {FoveaDOMAstNode | undefined} parentNode
	 * @param {boolean} isRootNode
	 * @param {IContext} context
	 * @returns {IFoveaDOMAstTextNode[]}
	 */
	private convertStringNodeToFoveaDOMAstTextNodes (node: string, insidePreserveFormattingNode: boolean, parentNode: FoveaDOMAstNode|undefined, isRootNode: boolean, context: IContext): IFoveaDOMAstTextNode[] {
		// Prepare as many text nodes as required. Create one for each evaluation.
		const formatter = (part: string) => {
			const isExpression = containsExpression(part);
			return <IFoveaDOMAstTextNode> {
				type: "text",
				content: insidePreserveFormattingNode ? part : isExpression ? this.expressionUtil.formatExpression(part, context) : takeInnerExpression(part),
				parentNode,
				isRootNode,
				stringify: (onlyInnerContent: boolean = false) => this.stringifyAstRawNode(node, onlyInnerContent),
				toString: () => this.stringifyAstRawNode(node)
			};
		};
		return insidePreserveFormattingNode
			? [formatter(node)]
			: splitByExpressions(node).map(part => formatter(part));
	}

	/**
	 * Gets the FoveaDOMAstKind of an IDOMAstNodeRaw
	 * @param {IDOMAstNodeRaw} node
	 * @returns {FoveaDOMAstKind}
	 */
	private getFoveaDOMAstKind (node: IDOMAstNodeRaw): FoveaDOMAstKind {
		return node.svgOrChildOfSvg ? "svg" : HTML_TAG_NAMES.has(<HtmlTagName> node.tag) ? "native" : "custom";
	}

	/**
	 * Maps a key-value pair for an attribute (such as '["class", "foo"]') to an IFoveaDOMAstAttribute
	 * @param {[string, string]} entry
	 * @param {IContext} context
	 * @param {boolean} keyValueSeparated
	 * @returns {IFoveaDOMAstAttribute}
	 */
	private mapRawEntryToFoveaDOMAttribute (entry: [string, string], context: IContext, keyValueSeparated: boolean): IFoveaDOMAstAttribute {
		let [name, value] = entry;
		// If the key ends with a +, it means that the value should be appended to whatever value is given already
		const isAppend = name.endsWith("+");

		if (isAppend) {
			// Remove the ending "+" from the name
			name = name.slice(0, -1);
		}

		let returnValue: RawExpressionChainBindable|IRawExpressionChainBindableDict|null = null;

		// Return IExpressions or raw parts, depending on whether or not the splitted parts are expressions
		const prepareExpressionChain = (propertyValue: string) => splitByExpressions(propertyValue)
			.map(part => EXPRESSION_FULL_QUALIFIER.test(part)
				? this.expressionUtil.formatExpression(part, context)
				: part
			);

		if (keyValueSeparated || isAppend) {
			// Parse the string for key-value pairs
			const keyValueSeparatedValue = this.keyValueParser.parse(value);

			// If parsing was successful
			if (typeof keyValueSeparatedValue !== "string") {
				const dict: IRawExpressionChainBindableDict = {};
				Object.entries(keyValueSeparatedValue).forEach(([propertyKey, propertyValue]) => {
					dict[propertyKey] = prepareExpressionChain(propertyValue);
				});
				returnValue = dict;
			}
		}

		if (returnValue == null) {
			returnValue = prepareExpressionChain(value);
		}

		return {
			name,
			value: returnValue
		};
	}

	/**
	 * Maps a key-value pair for an attribute (such as '["class", "foo"]') to an IFoveaDOMAstListener
	 * @param {[string, string]} entry
	 * @param {IContext} context
	 * @returns {IFoveaDOMAstListener}
	 */
	private mapRawEntryToFoveaDOMListener (entry: [string, string], context: IContext): IFoveaDOMAstListener {
		const [name, value] = entry;
		// Split the value by evaluations and remove empty contents
		const splittedByExpressions = splitByExpressions(value);
		const actualName = name.slice(LISTENER_QUALIFIER.length);

		return {
			name: actualName,
			// Return IExpressions or raw parts, depending on whether or not the splitted parts are evaluations are not
			handler: splittedByExpressions
				.map(part => EXPRESSION_FULL_QUALIFIER.test(part)
					? this.expressionUtil.formatExpression(part, context)
					: part
				)
		};
	}
}