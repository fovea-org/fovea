import {IDOMGenerator} from "./i-dom-generator";
import {IDOMGeneratorOptions} from "./i-dom-generator-options";
import {IDOMGeneratorResult, IDOMGeneratorTemplateInstructionsResult} from "./i-dom-generator-result";
import {IDOMNodeHandler} from "../../dom-handler/dom-node-handler/i-dom-node-handler";
import {IDOMHTMLElementHandler} from "../../dom-handler/dom-html-element-handler/i-dom-html-element-handler";
import {IDOMSVGElementHandler} from "../../dom-handler/dom-svg-element-handler/i-dom-svg-element-handler";
import {IDOMUtil} from "../../../util/dom-util/i-dom-util";
import {IDOMElementHandlerResult} from "../../dom-handler/dom-element-handler/i-dom-element-handler-result";
import {isFoveaDOMAstSvgElement} from "../../is-fovea-dom-ast-svg-element/is-fovea-dom-ast-svg-element";
import {isFoveaDOMAstHTMLElement} from "../../is-fovea-dom-ast-html-element/is-fovea-dom-ast-html-element";
import {isFoveaDOMAstElement} from "../../is-fovea-dom-ast-element/is-fovea-dom-ast-element";
import {NodeUuid} from "../../node-uuid/node-uuid";
import {IDOMGeneratorGenerateTemplateInstructionsOptions} from "./i-dom-generator-generate-template-instructions-options";
import {IDOMGeneratorBuildNodeInstructionsOptions} from "./i-dom-generator-build-node-instructions-options";
import {IContextUtil} from "../../../util/context-util/i-context-util";
import {FoveaDOMAstNode} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {IContext} from "../../../util/context-util/i-context";
import {FOREACH_CUSTOM_ATTRIBUTE_QUALIFIER, IF_CUSTOM_ATTRIBUTE_QUALIFIER} from "@fovea/common";

/**
 * A class that can generate dom instructions from a HTMLBodyElement.
 */
export class DOMGenerator implements IDOMGenerator {

	constructor (private readonly domNodeHandler: IDOMNodeHandler,
							 private readonly domHtmlElementHandler: IDOMHTMLElementHandler,
							 private readonly domSvgElementHandler: IDOMSVGElementHandler,
							 private readonly domUtil: IDOMUtil,
							 private readonly contextUtil: IContextUtil) {
	}

	/**
	 * Returns a @ts-ignore comment. Use it to silence implicit any errors
	 * @returns {string}
	 */
	private get tsIgnoreComment (): string {
		return `\n// @ts-ignore`;
	}

	/**
	 * Recursively generates statements to generate a component's local DOM.
	 * @param {FoveaDOMAst} ast
	 * @param {IContext} context
	 * @param {Set<string>} skipTags
	 * @returns {IDOMGeneratorResult}
	 */
	public generate ({ast, context, skipTags}: IDOMGeneratorOptions): IDOMGeneratorResult {
		return {
			...this.generateTemplateInstructions({ast, context, skipTags})
		};
	}

	/**
	 * Generates template instructions for the provided AST. This builds up a HTMLTemplate element that
	 * can be imported for concrete instances
	 * @param {IDOMGeneratorGenerateTemplateInstructionsOptions} options
	 * @returns {IDOMGeneratorTemplateInstructionsResult}
	 */
	private generateTemplateInstructions ({ast, context, skipTags}: IDOMGeneratorGenerateTemplateInstructionsOptions): IDOMGeneratorTemplateInstructionsResult {
		// Generate instructions for nodes and elements
		const nodeInstructions = this.buildNodeInstructions({ast, context, skipTags});

		// Reset the Uuid
		this.domNodeHandler.resetUuid();

		// Flatten them
		const flattenedBuildNodeInstructions = this.flattenBuildNodeInstructions(nodeInstructions);

		// Wrap them and attach root identifiers to a template
		return {
			amount: (
				nodeInstructions.addCustomAttributeInstructions.length +
				nodeInstructions.addListenerInstructions.length +
				nodeInstructions.addPropertyInstructions.length +
				nodeInstructions.addRefInstructions.length +
				nodeInstructions.appendInstructions.length +
				nodeInstructions.createInstructions.length
			),
			instructions: (
				context.mode === "template" ? (
						// Add in all node instructions
						flattenedBuildNodeInstructions +
						// Map the generated root nodes to the host constructor
						this.generateRootNodesReturnInstruction(nodeInstructions.rootIdentifiers)
					)
					: (
						`return [` +
						flattenedBuildNodeInstructions +
						`\n];`
					)
			)
		};
	}

	/**
	 * Generates an instruction to assign the root nodes to a host constructor
	 * @param {NodeUuid[]} rootNodes
	 * @returns {string}
	 */
	private generateRootNodesReturnInstruction (rootNodes?: NodeUuid[]): string {
		if (rootNodes == null) return "";
		return `\nreturn [${rootNodes.join(", ")}];`;
	}

	/**
	 * Takes an IDOMElementHandlerResult and flattens all of its instructions.
	 * @param {IDOMElementHandlerResult} result
	 * @returns {string}
	 */
	private flattenBuildNodeInstructions (result: IDOMElementHandlerResult): string {
		let instructions = "";

		// Add all 'create' statements in top
		result.createInstructions.forEach(instruction => instructions += this.tsIgnoreComment + instruction.instruction);

		// Add all tagName statements
		result.addRefInstructions.forEach(instruction => instructions += instruction.instruction);

		// Make sure that all elements are appended to one another before mutating properties and attributes (required by spec)
		result.appendInstructions.forEach(instruction => instructions += instruction.instruction);

		// Add all 'add property' instructions
		result.addPropertyInstructions.forEach(instruction => instructions += this.tsIgnoreComment + instruction.instruction);

		// Add all 'add listener[s]' instructions
		result.addListenerInstructions.forEach(instruction => instructions += this.tsIgnoreComment + instruction.instruction);

		// Add all custom attribute instructions
		result.addCustomAttributeInstructions.forEach(instruction => instructions += this.tsIgnoreComment + instruction);

		return instructions;
	}

	/**
	 * Takes whatever relevant metadata it can from the provided node
	 * @param {FoveaDOMAstNode} node
	 * @param {IContext} context
	 */
	private consumeContextForNode (node: FoveaDOMAstNode, context: IContext): void {
		if (!isFoveaDOMAstElement(node)) return;

		// Check the node name to see if there is a referenced custom selector there
		this.conditionallyConsumeReferencedCustomSelector(node.name, "component", context);

		// Check all of its custom attributes to see if there is a referenced custom selector there
		node.customAttributes.forEach(({name}) => {
			// Only handle the custom attribute if it is not one of the ones that Fovea supplies by itself.
			if (name !== FOREACH_CUSTOM_ATTRIBUTE_QUALIFIER && name !== IF_CUSTOM_ATTRIBUTE_QUALIFIER) {
				this.conditionallyConsumeReferencedCustomSelector(name, "custom-attribute", context);
			}
		});
	}

	/**
	 * Checks if a selector refers to something that is built-in and adds it to the context as a referenced custom selector if not.
	 * @param {string} selector
	 * @param {string} kind
	 * @param {IContext} context
	 */
	private conditionallyConsumeReferencedCustomSelector (selector: string, kind: "component"|"custom-attribute", context: IContext): void {
		// If its' selector is not one of the built-in ones, add it to the Set of referenced Custom Selectors
		if (!this.domUtil.isBuiltInSelector(selector) && selector !== this.domUtil.selfReferenceNodeName) {
			const has = context.referencedCustomSelectors.some(value => value.kind === kind && value.selector === selector);
			if (!has) {
				context.referencedCustomSelectors.push({kind, selector});
			}
		}
	}

	/**
	 * Recursively walks through all the provided nodes and delegates the responsibility of handling the nodes to the various handlers.
	 * For example, SVGElements are handled by the DOMSVGElementHandler and so on.
	 * @param {IDOMGeneratorBuildNodeInstructionsOptions} options
	 * @returns {IDOMElementHandlerResult}
	 */
	private buildNodeInstructions ({ast, context, skipTags}: IDOMGeneratorBuildNodeInstructionsOptions): IDOMElementHandlerResult {
		// Generate some empty DOMHandler results
		let domHandlerResults = this.domUtil.emptyResult;

		ast.forEach(node => {
			// Add the context for the node
			this.contextUtil.addContextForNode(node, context);
			this.consumeContextForNode(node, context);

			// If the node should be skipped, add it to the skipped parts array
			if (isFoveaDOMAstElement(node) && skipTags.has(node.name)) {
				context.skippedParts.push({
					full: node.stringify(),
					inner: node.stringify(true)
				});
			}

			// Otherwise, pass it through its paces
			else {
				if (isFoveaDOMAstSvgElement(node)) domHandlerResults = this.domUtil.mergeInstructions(domHandlerResults, this.domSvgElementHandler.handle({node, context}));
				else if (isFoveaDOMAstHTMLElement(node)) domHandlerResults = this.domUtil.mergeInstructions(domHandlerResults, this.domHtmlElementHandler.handle({node, context}));
				else domHandlerResults = this.domUtil.mergeInstructions(domHandlerResults, this.domNodeHandler.handle({node, context}));

				// Call generate recursively for all children of the node.
				if (isFoveaDOMAstElement(node)) domHandlerResults = this.domUtil.mergeInstructions(domHandlerResults, this.buildNodeInstructions({ast: node.children, context, skipTags}));
			}
		});

		// Clean up after all work is done
		ast.forEach(node => {
			this.contextUtil.disposeContextForNode(node);
			this.contextUtil.disposeTemplateVariablesForNode(node);
			this.contextUtil.disposeAdditionalHostIdentifiersForNode(node);
		});

		// Return the results
		return domHandlerResults;
	}
}