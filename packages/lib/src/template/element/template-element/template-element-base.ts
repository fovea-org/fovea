import {ITemplateElement} from "./i-template-element";
import {ExpressionChain, Ref} from "@fovea/common";
import {TemplateNode} from "../../node/template-node";
import {ITemplateProperty} from "../../template-property/i-template-property";
import {ITemplateListener} from "../../template-listener/i-template-listener";
import {TemplateElementResult} from "../../template-result/template-result/template-element-result";
import {TemplateBase} from "../../template-base/template-base";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";
import {IExpressionChainDict} from "../../../observe/expression-chain/i-expression-chain-dict";

/**
 * An abstract base TemplateElement class
 */
export abstract class TemplateElementBase extends TemplateBase implements ITemplateElement {

	/**
	 * The ref for the TemplateElement (such as: '#myRef')
	 * @type {Ref}
	 */
	public ref: Ref|null = null;

	/**
	 * The children of this TemplateElement
	 * @type {TemplateNode[]}
	 */
	public children: TemplateNode[] = [];

	/**
	 * The attributes of this TemplateElement
	 * @type {ITemplateProperty[]}
	 */
	public attributes: ITemplateProperty[] = [];

	/**
	 * The listeners of this TemplateElement
	 * @type {ITemplateListener[]}
	 */
	public listeners: ITemplateListener[] = [];

	/**
	 * All customAttributes (not including *foreach and/or *if) of this TemplateElement
	 * @type {ITemplateProperty[]}
	 */
	public customAttributes: ITemplateProperty[] = [];

	/**
	 * The properties of this TemplateElement
	 * @type {ITemplateProperty[]}
	 */
	public properties: ITemplateProperty[] = [];

	constructor (public readonly selector: string,
							 public readonly namespace: string|null) {
		super();
	}

	/**
	 * Adds a child element
	 * @param {TemplateNode} child
	 */
	public appendChild (child: TemplateNode): void {
		this.children.push(child);
	}

	/**
	 * Adds a Custom Attribute to the Template
	 * @param {string} name
	 * @param {ExpressionChain|IExpressionChainDict} value
	 */
	public addCustomAttribute (name: string, value?: ExpressionChain|IExpressionChainDict): void {
		this.customAttributes.push({key: name, value});
	}

	/**
	 * Adds an attribute to the Template
	 * @param {string} key
	 * @param {ExpressionChain|IExpressionChainDict} value
	 */
	public addAttribute (key: string, value?: ExpressionChain|IExpressionChainDict): void {
		this.attributes.push({key, value});
	}

	/**
	 * Sets a property on the TemplateElement
	 * @param {string} key
	 * @param {ExpressionChain} value
	 */
	public setProperty (key: string, value?: ExpressionChain): void {
		this.properties.push({key, value});
	}

	/**
	 * Adds a listener.
	 * @param {string} name
	 * @param {ExpressionChain} handler
	 */
	public addListener (name: string, handler: ExpressionChain): void {
		this.listeners.push({name, handler});
	}

	/**
	 * Adds a Ref.
	 * @param {Ref} ref
	 */
	public addRef (ref: Ref): void {
		this.ref = ref;
	}

	/**
	 * Constructs a new element
	 * @param {ITemplateConstructOptions} options
	 * @returns {TemplateElementResult}
	 */
	public abstract construct (options: ITemplateConstructOptions): TemplateElementResult;

	/**
	 * Merges a TemplateElement with another base
	 * @param {ITemplateElement} base
	 */
	protected mergeBase (base?: ITemplateElement): void {
		// If a base is given, merge with the model
		if (base != null) {
			this.children.push(...base.children);
			if (base.ref != null) this.ref = base.ref;
			this.listeners.push(...this.copyTemplateListeners(base.listeners));
			this.customAttributes.push(...this.copyTemplateProperties(base.customAttributes));
			this.properties.push(...this.copyTemplateProperties(base.properties));
			this.attributes.push(...this.copyTemplateProperties(base.attributes));
		}
	}

	/**
	 * Copies the given ITemplateProperty elements
	 * @param {ITemplateProperty[]} properties
	 * @returns {ITemplateProperty[]}
	 */
	private copyTemplateProperties (properties: ITemplateProperty[]): ITemplateProperty[] {
		return properties.map(property => this.copyProperty(property));
	}

	/**
	 * Copies the given ITemplateProperty
	 * @param {string} key
	 * @param {ExpressionChain} value
	 * @returns {ITemplateProperty}
	 */
	private copyProperty ({key, value}: ITemplateProperty): ITemplateProperty {
		return {
			key,
			value: value == null ? undefined : Array.isArray(value) ? [...value] : Object.assign({}, ...Object.entries(value).map(([propertyName, chain]) => ({[propertyName]: chain == null ? undefined : [...chain]})))
		};
	}

	/**
	 * Copies the given ITemplateListener elements
	 * @param {ITemplateListener[]} listeners
	 * @returns {ITemplateListener[]}
	 */
	private copyTemplateListeners (listeners: ITemplateListener[]): ITemplateListener[] {
		return listeners.map(listener => this.copyListener(listener));
	}

	/**
	 * Copies the given ITemplateListener
	 * @param {string} name
	 * @param {ExpressionChain} handler
	 * @returns {ITemplateListener}
	 */
	private copyListener ({name, handler}: ITemplateListener): ITemplateListener {
		return {
			name,
			handler: [...handler]
		};
	}
}
