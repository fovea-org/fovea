import {IDOMNodeHandler} from "./i-dom-node-handler";
import {IDOMNodeHandlerOptions} from "./i-dom-node-handler-options";
import {IDOMNodeHandlerResult} from "./i-dom-node-handler-result";
import {DOMHandler} from "../dom-handler/dom-handler";
import {IDOMHandlerCreateResult} from "../dom-handler/i-dom-handler-create-result";
import {IFoveaDOMAstTextNode} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {isRawExpressionBindable} from "../../../expression/raw-expression-bindable/is-raw-expression-bindable";
import {IContext} from "../../../util/context-util/i-context";

/**
 * A class that handles dom nodes.
 */
export class DOMNodeHandler extends DOMHandler implements IDOMNodeHandler {

	/**
	 * Generates an instruction to create a new TextNode with the given data
	 * @param {IFoveaDOMAstTextNode} node
	 * @param {IContext} context
	 * @returns {IDOMHandlerCreateResult}
	 */
	public create (node: IFoveaDOMAstTextNode, context: IContext): IDOMHandlerCreateResult {
		return this.createNodeWithArguments(
			node,
			isRawExpressionBindable(node.content)
				? `${this.useHelper(node, "createExpressionTextNode")}(${this.stringifyExpression(node, node.content)})`
				: `${this.useHelper(node, "createTextNode")}(${this.quote(node.content)})`,
			context
		);
	}

	/**
	 * Handles a Node.
	 * @param {IFoveaDOMAstTextNode} node
	 * @returns {IDOMHTMLElementHandlerResult}
	 */
	public handle ({node, context}: IDOMNodeHandlerOptions): IDOMNodeHandlerResult {
		// Return no instructions if the node has no actual text content.
		if (!isRawExpressionBindable(node.content) && (node.content == null || node.content === "")) return this.domUtil.emptyResult;

		// Generate a 'create' instruction.
		const createInstructions = [this.create(node, context)];

		// Generate an 'append' instruction if the node has a parent.
		const appendInstructions = node.parentNode == null ? [] : [this.append(node, node.parentNode, context)];

		// If the node has no parent, this is one of the root nodes of the template
		const rootIdentifiers = node.parentNode == null ? createInstructions.map(instruction => instruction.identifier) : [];

		return {
			createInstructions,
			appendInstructions,
			rootIdentifiers
		};
	}

}