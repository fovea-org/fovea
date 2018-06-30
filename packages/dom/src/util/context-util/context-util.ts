import {IContextUtil} from "./i-context-util";
import {FoveaDOMAstNode} from "../../dom/fovea-dom-ast/i-fovea-dom-ast";
import {IContext} from "./i-context";
import {HostIdentifier} from "@fovea/common";

/**
 * A class that helps with operations having to do with a current compilation context
 */
export class ContextUtil implements IContextUtil {
	/**
	 * A WeakMap between Nodes and the template-declared variables they can access from their position in the DOM
	 * @type {WeakMap<FoveaDOMAstNode, string[]>}
	 */
	private readonly nodeToTemplateVariablesMap: WeakMap<FoveaDOMAstNode, string[]> = new WeakMap();

	/**
	 * A WeakMap between Nodes and a map between template variables and additional host identifiers that should be observed
	 * @type {WeakMap<FoveaDOMAstNode, string[]>}
	 */
	private readonly nodeToTemplateVariableToAdditionalHostIdentifiersMap: Map<FoveaDOMAstNode, Map<string, HostIdentifier[]>> = new Map();

	/**
	 * A Map between Nodes and the current compilation context
	 * @type {WeakMap<FoveaDOMAstNode, IContext>}
	 */
	private readonly nodeToContextMap: WeakMap<FoveaDOMAstNode, IContext> = new WeakMap();

	/**
	 * Gets the current IContext for the given node
	 * @param {FoveaDOMAstNode} node
	 * @returns {IContext}
	 */
	public getContextForNode (node: FoveaDOMAstNode): IContext {
		const context = this.nodeToContextMap.get(node);
		if (context == null) {
			throw new ReferenceError(`Internal Error: Could not get a Context for a node`);
		}
		return context;
	}

	/**
	 * Adds the current IContext for the given node
	 * @param {FoveaDOMAstNode} node
	 * @param {IContext} context
	 */
	public addContextForNode (node: FoveaDOMAstNode, context: IContext): void {
		this.nodeToContextMap.set(node, context);
	}

	/**
	 * Disposes the current Context for a Node
	 * @param {FoveaDOMAstNode} node
	 */
	public disposeContextForNode (node: FoveaDOMAstNode): void {
		this.nodeToContextMap.delete(node);
	}

	/**
	 * Gets all the template-declared variables the given node has access to from its position in the DOM
	 * @param {FoveaDOMAstNode} node
	 * @returns {string[]}
	 */
	public getTemplateVariablesForNode (node: FoveaDOMAstNode): string[] {
		const ownVariables = this.nodeToTemplateVariablesMap.get(node);
		const allVariables: string[] = [...(ownVariables == null ? [] : ownVariables)];
		let parent = node.parentNode;
		while (parent != null) {
			allVariables.push(...this.getTemplateVariablesForNode(parent));
			parent = parent.parentNode;
		}
		return [...new Set(allVariables)];
	}

	/**
	 * Adds the given template-declared variables for the given node
	 * @param {FoveaDOMAstNode} node
	 * @param {Iterable<string>} templateVariables
	 */
	public addTemplateVariablesForNode (node: FoveaDOMAstNode, templateVariables: Iterable<string>): void {
		let existing = this.nodeToTemplateVariablesMap.get(node);
		if (existing == null) {
			existing = [];
			this.nodeToTemplateVariablesMap.set(node, existing);
		}
		existing.push(...templateVariables);
	}

	/**
	 * Disposes the template-declared variables for the given node
	 * @param {FoveaDOMAstNode} node
	 */
	public disposeTemplateVariablesForNode (node: FoveaDOMAstNode): void {
		this.nodeToTemplateVariablesMap.delete(node);
	}

	/**
	 * Gets all the additional host identifiers for a given template variable for a node
	 * @param {FoveaDOMAstNode} node
	 * @param {string} templateVariable
	 * @returns {string[]}
	 */
	public getAdditionalHostIdentifiersForTemplateVariableForNode (node: FoveaDOMAstNode, templateVariable: string): HostIdentifier[] {
		const map = this.getAdditionalHostIdentifiersForNode(node);
		const forTemplateVariable = map.get(templateVariable);
		return forTemplateVariable == null ? [] : forTemplateVariable;
	}

	/**
	 * Gets all the additional host identifiers for a given node
	 * @param {FoveaDOMAstNode} node
	 * @returns {string[]}
	 */
	public getAdditionalHostIdentifiersForNode (node: FoveaDOMAstNode): Map<string, HostIdentifier[]> {
		// First take the node's own host identifiers
		let allAdditionalHostIdentifiers = this.nodeToTemplateVariableToAdditionalHostIdentifiersMap.get(node);

		// Make sure we have a Map to work with
		if (allAdditionalHostIdentifiers == null) {
			allAdditionalHostIdentifiers = new Map();
		}

		let parent = node.parentNode;

		while (parent != null) {
			// Take the parent's additional host identifiers
			const parentMap = this.getAdditionalHostIdentifiersForNode(parent);

			for (const [parentTemplateVariable, parentHostIdentifiers] of parentMap.entries()) {
				// Take the existing host identifiers for that template variable
				let existingHostIdentifiers = allAdditionalHostIdentifiers.get(parentTemplateVariable);

				// If it doesn't already have some, initialize it and set it on the map
				if (existingHostIdentifiers == null) {
					existingHostIdentifiers = [];
					allAdditionalHostIdentifiers.set(parentTemplateVariable, existingHostIdentifiers);
				}

				// Add all of the HostIdentifiers that it doesn't already include
				parentHostIdentifiers.forEach(parentHostIdentifier => {
					if (!existingHostIdentifiers!.includes(parentHostIdentifier)) {
						existingHostIdentifiers!.push(parentHostIdentifier);
					}
				});
			}
			parent = parent.parentNode;
		}
		return allAdditionalHostIdentifiers;
	}

	/**
	 * Adds the given additional host identifiers for a template variable for a node
	 * @param {FoveaDOMAstNode} node
	 * @param {string} templateVariable
	 * @param {Iterable<HostIdentifier>} hostIdentifiers
	 */
	public addAdditionalHostIdentifiersForTemplateVariableForNode (node: FoveaDOMAstNode, templateVariable: string, hostIdentifiers: Iterable<HostIdentifier>): void {
		let existingMap = this.nodeToTemplateVariableToAdditionalHostIdentifiersMap.get(node);
		if (existingMap == null) {
			existingMap = new Map();
			this.nodeToTemplateVariableToAdditionalHostIdentifiersMap.set(node, existingMap);
		}
		let existingHostIdentifiers = existingMap.get(templateVariable);
		if (existingHostIdentifiers == null) {
			existingHostIdentifiers = [];
			existingMap.set(templateVariable, existingHostIdentifiers);
		}
		existingHostIdentifiers.push(...hostIdentifiers);
	}

	/**
	 * Disposes the additional host identifiers for a Node
	 * @param {FoveaDOMAstNode} node
	 */
	public disposeAdditionalHostIdentifiersForNode (node: FoveaDOMAstNode): void {
		this.nodeToTemplateVariableToAdditionalHostIdentifiersMap.delete(node);
	}
}