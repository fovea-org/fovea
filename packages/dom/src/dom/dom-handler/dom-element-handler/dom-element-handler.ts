import {IDOMElementHandler} from "./i-dom-element-handler";
import {DOMHandler} from "../dom-handler/dom-handler";
import {IDOMElementHandlerOptions} from "./i-dom-element-handler-options";
import {IDOMElementHandlerResult} from "./i-dom-element-handler-result";
import {PropertyPosition} from "./property-position";
import {NodeUuid} from "../../node-uuid/node-uuid";
import {IDOMHandlerAddPropertyResult} from "../dom-handler/i-dom-handler-add-property-result";
import {IDOMElementHandlerAddSelectorResult} from "./i-dom-element-handler-add-selector-result";
import {FoveaDOMAstElement, IFoveaDOMAstAttribute, IFoveaDOMAstCustomAttribute, IFoveaDOMAstListener} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {isFoveaDOMAstCustomElement} from "../../is-fovea-dom-ast-custom-element/is-fovea-dom-ast-custom-element";
import {valueIsEmpty} from "../../fovea-dom-ast-generator/value-is-empty";
import {IDOMElementHandlerAddListenerResult} from "./i-dom-element-handler-add-listener-result";
import {IDOMElementHandlerAddListenersResult} from "./i-dom-element-handler-add-listeners-result";
import {CUSTOM_ELEMENT_REQUIRED_ATTRIBUTES, EXPRESSION_QUALIFIER_END, EXPRESSION_QUALIFIER_START, FOREACH_CUSTOM_ATTRIBUTE_AS_DEFAULT_VALUE, FOREACH_CUSTOM_ATTRIBUTE_INDEX_AS_DEFAULT_VALUE, FOREACH_CUSTOM_ATTRIBUTE_QUALIFIER, HostIdentifier, IF_CUSTOM_ATTRIBUTE_QUALIFIER} from "@fovea/common";
import {RawExpressionChainBindable} from "../../../expression/raw-expression-chain-bindable/raw-expression-chain-bindable";
import {ITemplateMultiElementOptions} from "./i-template-multi-element-options";
import {RawExpressionBindable} from "../../../expression/raw-expression-bindable/raw-expression-bindable";
import {IDOMHandlerCreateResult} from "../dom-handler/i-dom-handler-create-result";
import {IDOMElementHandlerCreateBaseOptions} from "./i-dom-element-handler-create-base-options";
import {IRawExpressionChainBindableDict} from "../../../expression/i-raw-expression-chain-bindable-dict/i-raw-expression-chain-bindable-dict";
import {camelCase, isInCamelCase, isInPascalCase, kebabCase} from "@wessberg/stringutil";
import {IContext} from "../../../util/context-util/i-context";

/**
 * An abstract class that handles Elements.
 */
export abstract class DOMElementHandler extends DOMHandler implements IDOMElementHandler {

	/**
	 * Adds an attribute to an element.
	 * @param {NodeUuid | FoveaDOMAstElement} element
	 * @param {IFoveaDOMAstAttribute} attribute
	 * @param {IContext} context
	 * @returns {string}
	 */
	public addAttribute (element: NodeUuid|FoveaDOMAstElement, {name, value}: IFoveaDOMAstAttribute, context: IContext): string {
		const {nodeUuid, node} = this.getNodeDict(element);

		// If the key is in camelCase or PascalCase, update it to kebab-case.
		const normalizedName = isInCamelCase(name) || isInPascalCase(name) ? kebabCase(name) : name;

		// Prepare the 'value' argument. Make sure it is undefined if no value (or the empty string) is given as argument value
		const valueArgument = valueIsEmpty(value) ? "" : `, ${this.stringifyExpressionChain(node, value)}`;
		return this.format(`${this.useHelper(node, "addAttribute")}(${nodeUuid}, ${this.quote(normalizedName)}${valueArgument})`, context);
	}

	/**
	 * Adds a Custom Attribute to an element.
	 * @param {NodeUuid | FoveaDOMAstElement} element
	 * @param {IFoveaDOMAstCustomAttribute} attribute
	 * @param {IContext} context
	 * @returns {string}
	 */
	public addCustomAttribute (element: NodeUuid|FoveaDOMAstElement, {name, value}: IFoveaDOMAstCustomAttribute, context: IContext): string {
		const {nodeUuid, node} = this.getNodeDict(element);

		// If the key is in camelCase or PascalCase, update it to kebab-case.
		const normalizedName = isInCamelCase(name) || isInPascalCase(name) ? kebabCase(name) : name;

		// Prepare the 'value' argument. Make sure it is undefined if no value (or the empty string) is given as argument value
		const valueArgument = valueIsEmpty(value) ? "" : `, ${this.stringifyExpressionChain(node, value)}`;
		return this.format(`${this.useHelper(node, "addCustomAttribute")}(${nodeUuid}, ${this.quote(normalizedName)}${valueArgument})`, context);
	}

	/**
	 * Adds all the provided attributes to the provided element
	 * @param {NodeUuid | FoveaDOMAstElement} element
	 * @param {IFoveaDOMAstAttribute[]} attributes
	 * @param {IContext} context
	 * @returns {string}
	 */
	public addAttributes (element: NodeUuid|FoveaDOMAstElement, attributes: IFoveaDOMAstAttribute[], context: IContext): string {
		const {nodeUuid, node} = this.getNodeDict(element);

		// Prepare the 'value' argument. Give it tuples of key-value pairs as REST arguments
		const valueArgument = attributes.map(({name, value}) => {
			// If the key is in camelCase or PascalCase, update it to kebab-case.
			const normalizedName = isInCamelCase(name) || isInPascalCase(name) ? kebabCase(name) : name;
			return `[${this.quote(normalizedName)}${valueIsEmpty(value) ? "" : `, ${this.stringifyExpressionChain(node, value)}`}]`;

		}).join(", ");
		return this.format(`${this.useHelper(node, "addAttributes")}(${nodeUuid}, ${valueArgument})`, context);
	}

	/**
	 * Sets a property value directly on an element.
	 * @param {NodeUuid | FoveaDOMAstElement} element
	 * @param {IFoveaDOMAstAttribute} attribute
	 * @param {IContext} context
	 * @returns {string}
	 */
	public addValue (element: NodeUuid|FoveaDOMAstElement, {name, value}: IFoveaDOMAstAttribute, context: IContext): string {
		const {nodeUuid, node} = this.getNodeDict(element);

		// Prepare the 'value' argument. If it is null or the empty string, set the property value to 'true'. Otherwise, assign the literal value to the property.
		const valueArgument = valueIsEmpty(value) ? "" : `, ${this.stringifyExpressionChain(node, value)}`;

		// Make sure that the key is camelCased.
		const propertyKey = camelCase(name);
		return this.format(`${this.useHelper(node, "addProperty")}(${nodeUuid}, ${this.quote(propertyKey)}${valueArgument})`, context);
	}

	/**
	 * Adds all the provided properties to the element.
	 * @param {NodeUuid | FoveaDOMAstElement} element
	 * @param {IFoveaDOMAstAttribute[]} properties
	 * @param {IContext} context
	 * @returns {string}
	 */
	public addValues (element: NodeUuid|FoveaDOMAstElement, properties: IFoveaDOMAstAttribute[], context: IContext): string {
		const {nodeUuid, node} = this.getNodeDict(element);

		// Prepare the 'value' argument. Give it tuples of key-value pairs as REST arguments
		const valueArgument = properties.map(property => `[${this.quote(property.name)}, ${valueIsEmpty(property.value) ? `[${this.quote("true")}]` : `${this.stringifyExpressionChain(node, property.value)}`}]`).join(", ");
		return this.format(`${this.useHelper(node, "addProperties")}(${nodeUuid}, ${valueArgument})`, context);
	}

	/**
	 * Handles an Element.
	 * @param {FoveaDOMAstElement} node
	 * @returns {IDOMElementHandlerResult}
	 */
	public handle ({node, context}: IDOMElementHandlerOptions): IDOMElementHandlerResult {
		// Generate a 'create' instruction.
		const createInstruction = this.create(node, context);

		// Generate an 'append' instruction if the node has a parent.
		const appendInstructions = node.parentNode == null ? [] : [this.append(node, node.parentNode, context)];

		// Add a ref for the node (if need be)
		const addRefInstructions = this.addRef(node, context);

		// Generate instructions for all the attributes of the element
		const handleAttributeInstructions = this.handleAttributes(node, context);

		// Generate instructions for all Custom Attributes of the element
		const addCustomAttributeInstructions = this.handleCustomAttributes(node, context);

		// Generate instructions for all listeners on the element
		const addListenerInstructions = this.handleListeners(node, context);

		// If the node has no parent, this is one of the root nodes of the template
		const rootIdentifiers = createInstruction == null ? undefined : node.parentNode == null ? [createInstruction.identifier] : [];

		return {
			appendInstructions,
			addListenerInstructions,
			addCustomAttributeInstructions,
			createInstructions: createInstruction == null ? [] : [createInstruction],
			rootIdentifiers,
			addPropertyInstructions: handleAttributeInstructions,
			addRefInstructions: addRefInstructions == null ? [] : [addRefInstructions]
		};
	}

	/**
	 * Adds a ref to the provided child (if it is selectable. It is selectable if it has a '#' followed by some text).
	 * @param {NodeUuid | FoveaDOMAstElement} child
	 * @param {IContext} context
	 * @returns {IDOMElementHandlerAddSelectorResult}
	 */
	public addRef (child: NodeUuid|FoveaDOMAstElement, context: IContext): IDOMElementHandlerAddSelectorResult|null {
		const {node, nodeUuid} = this.getNodeDict(child);

		// If the node has no ref, return null
		if (node.ref == null) return null;

		return {
			instruction: this.format(`${this.useHelper(node, "addRef")}(${nodeUuid}, "${node.ref}")`, context),
			ref: node.ref,
			type: node.name.toLowerCase()
		}
			;
	}

	/**
	 * Adds a 'listener' instruction
	 * @param {NodeUuid | FoveaDOMAstElement} element
	 * @param {IFoveaDOMAstListener} listener
	 * @param {IContext} context
	 * @returns {IDOMElementHandlerAddListenerResult}
	 */
	public addListener (element: NodeUuid|FoveaDOMAstElement, {name, handler}: IFoveaDOMAstListener, context: IContext): IDOMElementHandlerAddListenerResult {
		const {nodeUuid, node} = this.getNodeDict(element);
		this.contextUtil.addTemplateVariablesForNode(node, ["event"]);

		return {
			instruction: this.format(`${this.useHelper(node, "addListener")}(${nodeUuid}, ${this.quote(name)}, ${this.stringifyExpressionChain(node, handler)})`, context)
		};
	}

	/**
	 * Adds all the given 'listener' instructions
	 * @param {NodeUuid | FoveaDOMAstElement} element
	 * @param {IFoveaDOMAstListener} listeners
	 * @param {IContext} context
	 * @returns {IDOMElementHandlerAddListenerResult}
	 */
	public addListeners (element: NodeUuid|FoveaDOMAstElement, listeners: IFoveaDOMAstListener[], context: IContext): IDOMElementHandlerAddListenersResult {
		const {nodeUuid, node} = this.getNodeDict(element);
		this.contextUtil.addTemplateVariablesForNode(node, ["event"]);

		// Prepare the 'value' argument. Give it tuples of key-value pairs as REST arguments
		const valueArgument = listeners.map(listener => `[${this.quote(listener.name)}, ${this.stringifyExpressionChain(node, listener.handler)}]`).join(", ");

		return {
			instruction: this.format(`${this.useHelper(node, "addListeners")}(${nodeUuid}, ${valueArgument})`, context)
		};
	}

	/**
	 * Handles all the listeners on the node. Will generate '__addListener' or '__addListeners' instructions, depending on the amount of listeners.
	 * @param {NodeUuid | FoveaDOMAstElement} element
	 * @param {IContext} context
	 * @returns {IDOMElementHandlerAddListenersResult[]}
	 */
	public handleListeners (element: NodeUuid|FoveaDOMAstElement, context: IContext): IDOMElementHandlerAddListenersResult[] {
		const {node} = this.getNodeDict(element);
		return node.listeners.length === 0
			? []
			: node.listeners.length === 1
				? [this.addListener(element, node.listeners[0], context)]
				: [this.addListeners(element, node.listeners, context)];
	}

	/**
	 * Creates a new TemplateElement
	 * @param {FoveaDOMAstElement} element
	 * @param {IDOMElementHandlerCreateBaseOptions} options
	 * @param {IContext} context
	 * @returns {IDOMHandlerCreateResult?}
	 */
	protected createBase (element: FoveaDOMAstElement, {createConditionalElementName, createElementName, createMultiElementName}: IDOMElementHandlerCreateBaseOptions, context: IContext): IDOMHandlerCreateResult|undefined {
		if (context.mode === "hostAttributes" && element.name === this.domUtil.selfReferenceNodeName) {
			this.setNodeUuid(element, element.name);
			return undefined;
		}

		const ifCustomAttribute = element.customAttributes.find(customAttribute => customAttribute.name === IF_CUSTOM_ATTRIBUTE_QUALIFIER);
		const forEachCustomAttribute = element.customAttributes.find(customAttribute => customAttribute.name === FOREACH_CUSTOM_ATTRIBUTE_QUALIFIER);

		// Take the selector for the element
		const selector = this.quote(element.name.toLowerCase());

		// If it has a *foreach custom attribute
		if (forEachCustomAttribute != null) {
			// Take the options passed to the *foreach custom attribute as an attribute value
			const multiElementOptions = this.takeTemplateMultiElementOptions(forEachCustomAttribute.value);

			// Add all of the additional host identifiers from it
			this.addAdditionalHostIdentifiersFromTemplateMultiElementOptions(element, multiElementOptions);

			// Add all of the TemplateVariables from it
			this.addTemplateVariablesFromTemplateMultiElementOptions(element, multiElementOptions);

			// Generate the instruction for a TemplateNormalElement
			const normalElementInstruction = `${this.useHelper(element, createElementName)}(${selector})`;

			// Generate the instruction for the TemplateMultiElement and pass a lazy TemplateNormalElement instruction to it
			const multiElementInstruction = `${this.useHelper(element, createMultiElementName)}(${selector}, ${this.stringifyExpressionChain(element, multiElementOptions)}`;

			// If the node has a *foreach Custom Attribute AND an *if Custom Attribute, wrap a TemplateMultiElement inside a TemplateConditionalElement - and wrap a TemplateNormalElement inside the TemplateMultiElement
			if (ifCustomAttribute != null) {
				// Generate the instruction for the TemplateConditionalElement and pass a lazy TemplateMultiElement instruction to it
				const conditionalElementInstruction = `${this.useHelper(element, createConditionalElementName)}(${selector}, ${this.stringifyExpressionChain(element, ifCustomAttribute.value)}, () => ${normalElementInstruction})`;

				// Generate the full instruction
				return this.createNodeWithArguments(element, `${multiElementInstruction}, () => ${conditionalElementInstruction})`, context);
			}

			// Otherwise, if it only has an *foreach instruction, add a TemplateMultiElement instruction
			else {
				// Generate the full instruction
				return this.createNodeWithArguments(element, `${multiElementInstruction}, () => ${normalElementInstruction})`, context);
			}
		}

		// Otherwise, if it only has an *if instruction, add a TemplateConditionalElement instruction
		else if (ifCustomAttribute != null) {
			// Generate the instruction for a TemplateNormalElement
			const normalElementInstruction = `${this.useHelper(element, createElementName)}(${selector})`;

			// Generate a TemplateConditionalElement instruction and add a lazy TemplateNormalElement to it
			const conditionalElementInstruction = `${this.useHelper(element, createConditionalElementName)}(${selector}, ${this.stringifyExpressionChain(element, ifCustomAttribute.value)}, () => ${normalElementInstruction})`;

			// Generate the full instruction
			return this.createNodeWithArguments(element, conditionalElementInstruction, context);
		}

		// Otherwise, it is a simple TemplateNormalElement
		else {
			const normalElementInstruction = `${this.useHelper(element, createElementName)}(${selector})`;
			// Generate the full instruction
			return this.createNodeWithArguments(element, normalElementInstruction, context);
		}
	}

	/**
	 * Gets the PropertyPosition of a key on an element. This essentially means where to put a property.
	 * For native elements, we always place the properties as attributes.
	 * For custom elements, we always place the properties as properties (like element.foo = "bar") unless
	 * the key is included in the set of required attributes (for example, 'class' is a required attribute).
	 * @param {FoveaDOMAstElement} element
	 * @param {IContext} context
	 * @param {string} key
	 * @returns {PropertyPosition}
	 */
	protected getPropertyPosition (element: FoveaDOMAstElement, context: IContext, key: string): PropertyPosition {
		if (
			context.mode === "hostAttributes" || (isFoveaDOMAstCustomElement(element) && CUSTOM_ELEMENT_REQUIRED_ATTRIBUTES.has(key)) || !isFoveaDOMAstCustomElement(element)) {
			return "attribute";
		}
		// Otherwise, set it as a property
		return "property";
	}

	/**
	 * Adds all of the declared TemplateVariables from some TemplateMultiElementOptions
	 * @param {FoveaDOMAstElement} element
	 * @param {ITemplateMultiElementOptions} options
	 */
	private addTemplateVariablesFromTemplateMultiElementOptions (element: FoveaDOMAstElement, options: ITemplateMultiElementOptions): void {
		const indexAs = options.indexAs == null ? FOREACH_CUSTOM_ATTRIBUTE_INDEX_AS_DEFAULT_VALUE : options.indexAs.filter(part => typeof part === "string").join("");
		const as = options.as == null ? FOREACH_CUSTOM_ATTRIBUTE_AS_DEFAULT_VALUE : options.as.filter(part => typeof part === "string").join("");
		this.contextUtil.addTemplateVariablesForNode(element, [indexAs, as]);
	}

	/**
	 * Adds all of the additional host identifiers from some TemplateMultiElementOptions
	 * @param {FoveaDOMAstElement} element
	 * @param {ITemplateMultiElementOptions} options
	 */
	private addAdditionalHostIdentifiersFromTemplateMultiElementOptions (element: FoveaDOMAstElement, options: ITemplateMultiElementOptions): void {
		let additionalObserverKeys: HostIdentifier[] = [];

		// Take all additional host identifiers referenced by the model
		(<RawExpressionBindable[]> options.model.filter(part => typeof part !== "string"))
			.forEach(part => {
				const [, observerKeysComputeFunction, templateVariablesComputeFunction] = part;

				// Take the template variables for the element
				const templateVariables = this.contextUtil.getTemplateVariablesForNode(element);

				// Figure out which ones are being used
				const usedTemplateVariables = templateVariablesComputeFunction(...templateVariables);

				// Take the relevant additional host identifiers for all of the template variables
				usedTemplateVariables.forEach(templateVariable => {
					additionalObserverKeys.push(...this.contextUtil.getAdditionalHostIdentifiersForTemplateVariableForNode(element, templateVariable));
				});
				additionalObserverKeys.push(...observerKeysComputeFunction(templateVariables, ...additionalObserverKeys));
			});

		// Filter out duplicates
		additionalObserverKeys = [...new Set(additionalObserverKeys)];

		// Take the 'as' property. This is the one that will reference the bound model
		const as = options.as == null ? FOREACH_CUSTOM_ATTRIBUTE_AS_DEFAULT_VALUE : options.as.filter(part => typeof part === "string").join("");

		this.contextUtil.addAdditionalHostIdentifiersForTemplateVariableForNode(element, as, additionalObserverKeys);
	}

	/**
	 * Takes the TemplateMultiElementOptions for a RawExpressionChainBindable.
	 * These can be defined in one of two ways:
	 * 1. Semi-colon separated values (e.g.: *foreach="model: ${<value>}; indexAs?: <value>; as?: <value>")
	 * 2. One value only, indicating the model (e.g.: *foreach="${<value>}")
	 * @param {RawExpressionChainBindable} expressionChain
	 * @returns {ITemplateMultiElementOptions}
	 */
	private takeTemplateMultiElementOptions (expressionChain: RawExpressionChainBindable|IRawExpressionChainBindableDict): ITemplateMultiElementOptions {

		// If a proper ExpressionChain is given (e.g., no key-value separated pairs), shorthand notation is used
		if (Array.isArray(expressionChain)) {
			const [firstExpression] = expressionChain;

			// If the element isn't an expression, a simple string is provided (for example: *forEach="foo"). This behavior is not supported as we don't know how to convert that into an Iterable
			if (typeof firstExpression === "string") {
				throw new TypeError(`You used shorthand notation for defining a model for a '*forEach' Custom Attribute, but you didn't pass in any rich model. Remember to use '${EXPRESSION_QUALIFIER_START}...${EXPRESSION_QUALIFIER_END}' notation`);
			}

			return {
				model: expressionChain
			};
		}

		return {
			model: expressionChain.model == null ? [] : expressionChain.model,
			...(expressionChain.as == null ? {} : {as: expressionChain.as}),
			...(expressionChain.indexAs == null ? {} : {indexAs: expressionChain.indexAs})
		};
	}

	/**
	 * Handles all attributes of the provided node.
	 * @param {FoveaDOMAstElement} node
	 * @param {IContext} context
	 * @returns {IDOMHandlerAddPropertyResult[]}
	 */
	private handleAttributes (node: FoveaDOMAstElement, context: IContext): IDOMHandlerAddPropertyResult[] {
		return this.addProperties(node, node.attributes, context);
	}

	/**
	 * Handles all Custom Attributes of the provided node.
	 * @param {FoveaDOMAstElement} node
	 * @param {IContext} context
	 * @returns {string[]}
	 */
	private handleCustomAttributes (node: FoveaDOMAstElement, context: IContext): string[] {
		return node.customAttributes
		// Filter out the special custom attributes *foreach and *if
			.filter(customAttribute => customAttribute.name !== IF_CUSTOM_ATTRIBUTE_QUALIFIER && customAttribute.name !== FOREACH_CUSTOM_ATTRIBUTE_QUALIFIER)
			.map(customAttribute => this.addCustomAttribute(node, customAttribute, context));
	}

	/**
	 * Generates IDOMHandlerAddPropertyResults for all of the provided attributes.
	 * These will be grouped to safe precious bytes in the generated instructions.
	 * @param {FoveaDOMAstElement} node
	 * @param {IFoveaDOMAstAttribute[]} attributes
	 * @param {IContext} context
	 * @returns {IDOMHandlerAddPropertyResult[]}
	 */
	private addProperties (node: FoveaDOMAstElement, attributes: IFoveaDOMAstAttribute[], context: IContext): IDOMHandlerAddPropertyResult[] {
		const attributeProperties: IFoveaDOMAstAttribute[] = [];
		const propertyProperties: IFoveaDOMAstAttribute[] = [];

		attributes.forEach(attribute => {
			// Figure out the position for the property
			const position = this.getPropertyPosition(node, context, attribute.name);

			// Append it to the array of attributes or properties, depending on where to place it
			if (position === "attribute") attributeProperties.push(attribute);
			else propertyProperties.push(attribute);
		});

		// Prepare instructions for the attributes, if any exists
		const attributesResult: IDOMHandlerAddPropertyResult[]|(never[]) = attributeProperties.length === 0 ? [] : [{
			kind: "attribute",
			instruction: attributeProperties.length === 1 ? this.addAttribute(node, attributeProperties[0], context) : this.addAttributes(node, attributeProperties, context)
		}];

		// Prepare instructions for the properties, if any exists
		const propertiesResult: IDOMHandlerAddPropertyResult[]|(never[]) = propertyProperties.length === 0 ? [] : [{
			kind: "property",
			instruction: propertyProperties.length === 1 ? this.addValue(node, propertyProperties[0], context) : this.addValues(node, propertyProperties, context)
		}];
		return [
			...attributesResult,
			...propertiesResult
		];
	}

}