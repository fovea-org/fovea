import {ITemplateNormalElementResultOptions} from "./i-template-normal-element-result-options";
import {TemplateResultBase} from "../../template-result-base/template-result-base";
import {IExpressionChainObserver} from "../../../../observe/expression-chain/expression-chain-observer/i-expression-chain-observer";
import {ITemplateNormalElementResult} from "./i-template-normal-element-result";
import {ITemplateResult} from "../../template-result/i-template-result";
import {TemplateResult} from "../../template-result/template-result";
import {observeAttribute} from "../../../../attribute/observe-attribute/observe-attribute";
import {observeProperty} from "../../../../prop/observe-property/observe-property";
import {attachCustomAttribute} from "../../../../custom-attribute/attach-custom-attribute/attach-custom-attribute";
import {IObserver} from "../../../../observe/i-observer";
import {addRef} from "../../../../ref/add-ref/add-ref";
import {observeListener} from "../../../../listener/observe-listener/observe-listener";
import {IDestroyable} from "../../../../destroyable/i-destroyable";

// tslint:disable:no-unused-expression
// tslint:disable:no-any

/**
 * A class that reflects an instance of a TemplateNormalElement
 */
export class TemplateNormalElementResult extends TemplateResultBase implements ITemplateNormalElementResult {

	/**
	 * The instantiated element within the DOM
	 * @type {Element}
	 */
	public lastNode: Element|null;

	/**
	 * The expression observers that, when changed, should mutate the elements attributes
	 * @type {IExpressionChainObserver[]}
	 */
	private attributeObservers: IExpressionChainObserver[]|null;

	/**
	 * The expression observers that, when changed, should mutate the elements properties
	 * @type {IExpressionChainObserver[]}
	 */
	private propertyObservers: IExpressionChainObserver[]|null;

	/**
	 * The expression observers that, when changed, should set the 'value' property on the Custom Attributes that are set on this element
	 */
	private customAttributeObservers: (IObserver&IDestroyable)[]|null;

	/**
	 * The expression observers that, when changed, should mutate the elements listeners
	 * @type {IExpressionChainObserver[]}
	 */
	private listenerObservers: IExpressionChainObserver[]|null;

	/**
	 * The observer for a bound ref to the host
	 * @type {IObserver}
	 */
	private refObserver: IObserver|null;

	/**
	 * All constructed children of this element
	 * @type {TemplateResult[]}
	 */
	private constructedChildren: TemplateResult[]|null = [];

	constructor ({ref, attributes, properties, listeners, host, customAttributes, templateVariables, previousSibling, lastNode, owner, root, children}: ITemplateNormalElementResultOptions) {
		super({host, previousSibling, owner});

		this.lastNode = lastNode;

		// Upgrade it
		this.upgrade(host, this.lastNode, root);

		// Construct and append all children
		let previousSiblingForChild: ITemplateResult|null;
		children.forEach(child => {
			previousSiblingForChild = child.construct({host, owner: lastNode, root, templateVariables, previousSibling: previousSiblingForChild});
			if (this.constructedChildren != null) {
				this.constructedChildren.push(previousSiblingForChild);
			}
		});

		this.customAttributeObservers = customAttributes.map(customAttribute => attachCustomAttribute(host, lastNode, customAttribute.key, customAttribute.value, templateVariables));

		// Add the node to its owner
		this.attach(this.lastNode, owner);

		// If a ref is given, bind the ref to the host, prepended with a '$'
		if (ref != null) {
			this.refObserver = addRef(host, lastNode, ref);
		}

		// Observe all attributes
		this.attributeObservers = attributes.map(attribute => observeAttribute(host, lastNode, attribute, templateVariables));

		// Observe all properties
		this.propertyObservers = properties.map(property => observeProperty(host, lastNode, property, templateVariables));

		// Set all listeners
		this.listenerObservers = listeners.map(listener => observeListener(host, lastNode, listener, templateVariables));
	}

	/**
	 * Destroys an element completely (removes all traces of it)
	 */
	public destroy (): void {
		if (this.constructedChildren != null) {
			this.constructedChildren.forEach(child => child.destroy());
			this.constructedChildren = null;
		}

		if (this.lastNode != null) {
			this.detach(this.lastNode);

			if ("destroyedCallback" in this.lastNode) {
				if ("destroyedCallback" in this.lastNode) {
					(<any>this).lastNode.destroyedCallback();
				}
			}
			this.lastNode = null;
		}

		// Stop observing Custom Attribute expressions
		if (this.customAttributeObservers != null) {
			this.customAttributeObservers.forEach(observer => observer.destroy());
			this.customAttributeObservers = null;
		}

		this.disposeOrDestroyCommon();
	}

	/**
	 * Disposes an element
	 */
	public dispose (): void {
		if (this.constructedChildren != null) {
			this.constructedChildren.forEach(child => child.dispose());
			this.constructedChildren = null;
		}

		if (this.lastNode != null) {
			this.detach(this.lastNode);
			this.lastNode = null;
		}

		// Stop observing Custom Attribute expressions
		if (this.customAttributeObservers != null) {
			this.customAttributeObservers.forEach(observer => observer.unobserve());
			this.customAttributeObservers = null;
		}

		this.disposeOrDestroyCommon();
	}

	/**
	 * Common functionality across destroying and disposing
	 */
	private disposeOrDestroyCommon (): void {

		// Stop observing attribute expressions
		if (this.attributeObservers != null) {
			this.attributeObservers.forEach(observer => observer.unobserve());
			this.attributeObservers = null;
		}
		// Stop observing property expressions
		if (this.propertyObservers != null) {
			this.propertyObservers.forEach(observer => observer.unobserve());
			this.propertyObservers = null;
		}

		// Stop observing listener expressions
		if (this.listenerObservers != null) {
			this.listenerObservers.forEach(observer => observer.unobserve());
			this.listenerObservers = null;
		}

		if (this.refObserver != null) {
			this.refObserver.unobserve();
			this.refObserver = null;
		}
	}
}