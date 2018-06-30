import {IDOMHandler} from "./i-dom-handler";
import {IDOMHandlerOptions} from "./i-dom-handler-options";
import {IDOMHandlerResult} from "./i-dom-handler-result";
import {INodeDict} from "./i-node-dict";
import {NodeUuid} from "../../node-uuid/node-uuid";
import {IDOMHandlerAppendResult} from "./i-dom-handler-append-result";
import {IDOMHandlerCreateResult} from "./i-dom-handler-create-result";
import {IDOMUtil} from "../../../util/dom-util/i-dom-util";
import {FoveaDOMAstNode} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {isFoveaDOMAstNode} from "../../is-fovea-dom-ast-node/is-fovea-dom-ast-node";
import {IDOMHandlerAssignToVariableInstructionResult} from "./i-dom-handler-assign-to-variable-instruction-result";
import {HostIdentifier, LibHelperName} from "@fovea/common";
import {RawExpressionChainBindable} from "../../../expression/raw-expression-chain-bindable/raw-expression-chain-bindable";
import {RawExpressionBindable} from "../../../expression/raw-expression-bindable/raw-expression-bindable";
import {IContextUtil} from "../../../util/context-util/i-context-util";
import {IRawExpressionChainBindableDict} from "../../../expression/i-raw-expression-chain-bindable-dict/i-raw-expression-chain-bindable-dict";
import {ITemplateMultiElementOptions} from "../dom-element-handler/i-template-multi-element-options";
import {isQuoted} from "@wessberg/stringutil";

/**
 * An abstract base class for generating instructions for nodes, HTMLElements and SVGElements
 */
export abstract class DOMHandler implements IDOMHandler {
	/**
	 * An auto-incrementing UUID to assign to nodes as they are generated
	 * @type {number}
	 */
	private static uuid: number = 0;
	/**
	 * A WeakMap between FoveaDOMAstNodes and NodeUuids
	 * @type {WeakMap<FoveaDOMAstNode, NodeUuid>}
	 */
	private static readonly nodeToUuidMapper: WeakMap<FoveaDOMAstNode, NodeUuid> = new WeakMap();

	/**
	 * A Map between NodeUuids and FoveaDOMAstNodes
	 * @type {Map<NodeUuid, FoveaDOMAstNode>}
	 */
	private static readonly uuidToNodeMapper: Map<NodeUuid, FoveaDOMAstNode> = new Map();

	constructor (protected domUtil: IDOMUtil,
							 protected contextUtil: IContextUtil) {
	}

	/**
	 * Generates an appendChild instruction.
	 * @param {NodeUuid|FoveaDOMAstNode} nodeOrNodeUuid
	 * @param {NodeUuid|FoveaDOMAstNode} toNode
	 * @returns {string}
	 */
	public append (nodeOrNodeUuid: NodeUuid|FoveaDOMAstNode, toNode: NodeUuid|FoveaDOMAstNode): IDOMHandlerAppendResult {
		const {nodeUuid, node} = this.getNodeDict(nodeOrNodeUuid);

		return {
			instruction: this.format(`${this.useHelper(node, "addElement")}(${nodeUuid}, ${this.getNodeDict(toNode).nodeUuid})`)
		};
	}

	/**
	 * Creates an instruction for a new Node, HTMLElement or SVGElement
	 * @param {FoveaDOMAstNode} node
	 * @returns {IDOMHandlerCreateResult}
	 */
	public abstract create (node: FoveaDOMAstNode): IDOMHandlerCreateResult;

	/**
	 * Handles a Node.
	 * @abstract
	 * @param {FoveaDOMAstNode} node
	 * @returns {IDOMHandlerResult}
	 */
	public abstract handle ({node}: IDOMHandlerOptions): IDOMHandlerResult;

	/**
	 * Resets the uuid
	 */
	public resetUuid (): void {
		DOMHandler.uuid = 0;
	}

	/**
	 * Creates a new node with the provided amounts
	 * @abstract
	 * @param {FoveaDOMAstNode} node
	 * @param {string} argument
	 * @returns {string}
	 */
	protected createNodeWithArguments (node: FoveaDOMAstNode, argument: string): IDOMHandlerCreateResult {
		const {instruction, identifier} = this.assignToVariableInstruction(node);
		return {
			instruction: this.format(`${instruction}${argument}`),
			identifier
		};
	}

	/**
	 * Gets an INodeDict from the provided node or NodeUuid. This is an object containing both the
	 * node and its NodeUuid.
	 * @template T
	 * @param {NodeUuid | T} nodeOrNodeUuid
	 * @returns {INodeDict}
	 */
	protected getNodeDict<T extends FoveaDOMAstNode> (nodeOrNodeUuid: NodeUuid|T): INodeDict<T> {
		const node = <T> (isFoveaDOMAstNode(nodeOrNodeUuid) ? nodeOrNodeUuid : this.getNodeForUuid(nodeOrNodeUuid));

		// Map to the related NodeUuids.
		const nodeUuid = isFoveaDOMAstNode(node) ? this.getUuidForNode(node) : node;

		// Make sure that the node and NodeUuid are defined
		if (node == null) throw new ReferenceError(`${this.constructor.name} could not get a node for the provided NodeUuid: ${nodeOrNodeUuid}`);
		if (nodeUuid == null) throw new ReferenceError(`${this.constructor.name} could not get a NodeUuid for the provided node with node type: ${(<FoveaDOMAstNode>nodeOrNodeUuid).type}`);
		return {node, nodeUuid};
	}

	/**
	 * Quotes a string if necessary.
	 * @param {string} str
	 * @returns {string}
	 */
	protected quote (str: string): string {
		return isQuoted(str) ? str : JSON.stringify(str);
	}

	/**
	 * Gets a Node for a NodeUuid, if any exists
	 * @param {null|NodeUuid} uuid
	 * @returns {FoveaDOMAstNode|null}
	 */
	protected getNodeForUuid (uuid: null|NodeUuid): FoveaDOMAstNode|null {
		if (uuid == null) return null;
		const node = DOMHandler.uuidToNodeMapper.get(uuid);
		return node == null ? null : node;
	}

	/**
	 * Gets a NodeUuid for a node, if any exists.
	 * @param {null|FoveaDOMAstNode} node
	 * @returns {NodeUuid|null}
	 */
	protected getUuidForNode (node: null|FoveaDOMAstNode): NodeUuid|null {
		if (node == null) return null;
		const uuid = DOMHandler.nodeToUuidMapper.get(node);
		return uuid == null ? null : uuid;
	}

	/**
	 * Formats an instruction.
	 * @param {string} instruction
	 * @returns {string}
	 */
	protected format (instruction: string): string {
		// Make sure that the instruction starts with a newline.
		const beginning = instruction.startsWith("\n") ? "" : "\n";
		// Make sure that the instruction ends with a semi-colon.
		const end = instruction.endsWith(";") ? "" : ";";
		return `${beginning}${instruction}${end}`;
	}

	/**
	 * Generates a new NodeUuid. It will be auto-incrementing.
	 * @param {FoveaDOMAstNode} node
	 * @returns {string}
	 */
	protected generateNodeUuid (node: FoveaDOMAstNode): string {
		const nodeUuid = `_${DOMHandler.uuid++}`;
		DOMHandler.nodeToUuidMapper.set(node, nodeUuid);
		DOMHandler.uuidToNodeMapper.set(nodeUuid, node);
		return nodeUuid;
	}

	/**
	 * Stringifies an RawExpressionBindable
	 * @param {FoveaDOMAstNode} node
	 * @param {RawExpressionBindable} value
	 * @returns {string}
	 */
	protected stringifyExpression (node: FoveaDOMAstNode, value: RawExpressionBindable): string {
		const [compute, observerKeysComputeFunction, templateVariablesComputeFunction, isAsync] = value;
		const templateVariables = this.contextUtil.getTemplateVariablesForNode(node);
		const usedTemplateVariables = templateVariablesComputeFunction(...templateVariables);

		// Create an auxiliary array for the additional host identifiers
		const additionalObserverKeys: HostIdentifier[] = [];
		// Take the relevant additional host identifiers for all of the template variables
		usedTemplateVariables.forEach(templateVariable => {
			additionalObserverKeys.push(...this.contextUtil.getAdditionalHostIdentifiersForTemplateVariableForNode(node, templateVariable));
		});

		// Compute them
		const additionalObserverKeysComputed = observerKeysComputeFunction(templateVariables, ...additionalObserverKeys);

		return `[${compute(templateVariables, ...usedTemplateVariables)}, ${JSON.stringify(additionalObserverKeysComputed)}, ${isAsync}]`;
	}

	/**
	 * Stringifies an attribute value.
	 * @param {FoveaDOMAstNode} node
	 * @param {RawExpressionChainBindable|IRawExpressionChainBindableDict|ITemplateMultiElementOptions} value
	 * @returns {string}
	 */
	protected stringifyExpressionChain (node: FoveaDOMAstNode, value: RawExpressionChainBindable|IRawExpressionChainBindableDict|ITemplateMultiElementOptions): string {
		let str = "";

		// If it is a dict, stringify all of the key-value pairs
		if (!Array.isArray(value)) {
			str += "{";
			const entries = Object.entries(value);
			entries.forEach(([propertyKey, propertyValue], index) => {
				str += `"${propertyKey}": ${this.stringifyExpressionChain(node, propertyValue)}`;
				if (index !== entries.length -1) str += ",";
			});
			str += "}";
			return str;
		}

		str += "[";
		value.forEach((part, index) => {
			const isLastIndex = index === value.length - 1;

			// The part is a simple primitive value
			if (typeof part === "string") {
				str += this.quote(part);
			}

			// We're having an expression
			else {
				str += this.stringifyExpression(node, part);
			}

			if (!isLastIndex) str += ",";
		});
		str += "]";
		return str;
	}

	/**
	 * Uses one of the helpers from @fovea/lib
	 * @param {FoveaDOMAstNode} node
	 * @param {LibHelperName} helperName
	 * @returns {string}
	 */
	protected useHelper (node: FoveaDOMAstNode, helperName: LibHelperName): string {
		return this.domUtil.useHelper(helperName, this.contextUtil.getContextForNode(node));
	}

	/**
	 * Generates an partial instruction to assign something to a variable with the name of a NodeUuid.
	 * @param {FoveaDOMAstNode} node
	 * @returns {IDOMHandlerAssignToVariableInstructionResult}
	 */
	private assignToVariableInstruction (node: FoveaDOMAstNode): IDOMHandlerAssignToVariableInstructionResult {
		const identifier = this.generateNodeUuid(node);
		return {
			instruction: `const ${identifier} = `,
			identifier: identifier
		};
	}
}