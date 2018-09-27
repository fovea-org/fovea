import {ITemplateNormalElementResultOptions} from "./i-template-normal-element-result-options";
import {TemplateResultBase} from "../../template-result-base/template-result-base";
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
import {ricScheduler} from "@fovea/scheduler";

// tslint:disable:no-any

// tslint:disable:no-unused-expression

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
	 * @type {IObserver[]}
	 */
	private attributeObservers: IObserver[]|null;

	/**
	 * The expression observers that, when changed, should mutate the elements properties
	 * @type {IObserver[]}
	 */
	private propertyObservers: IObserver[]|null;

	/**
	 * The expression observers that, when changed, should set the 'value' property on the Custom Attributes that are set on this element
	 */
	private customAttributeObservers: (IObserver&IDestroyable)[]|null;

	/**
	 * The expression observers that, when changed, should mutate the elements listeners
	 * @type {IObserver[]}
	 */
	private listenerObservers: IObserver[]|null;

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
		super({host, previousSibling, owner, root});

		this.lastNode = lastNode;

		// Construct and append all children
		let previousSiblingForChild: ITemplateResult|null;
		children.forEach(child => {
			previousSiblingForChild = child.construct({host, owner: lastNode, root, templateVariables, previousSibling: previousSiblingForChild});
			if (this.constructedChildren != null) {
				this.constructedChildren.push(previousSiblingForChild);
			}
		});

		this.customAttributeObservers = customAttributes.map(customAttribute => attachCustomAttribute(host, lastNode, customAttribute.key, customAttribute.value, templateVariables));

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

		// Add the node to its owner
		this.attach(lastNode, owner);
	}

	/**
	 * Destroys an element completely (removes all traces of it)
	 */
	public destroy (): void {
		this.destroyed = true;

		if (this.lastNode != null) {
			this.detach(this.lastNode);

			if ("destroyedCallback" in this.lastNode) {
				(<any>this).lastNode.destroyedCallback();
			}
			this.lastNode = null;
		}

		// Dispose observers some time in the future
		ricScheduler.mutate(this.disposeObservers.bind(this)).then();
	}

	/**
	 * Disposes an element
	 */
	public dispose (): void {
		this.disposed = true;

		if (this.lastNode != null) {
			this.detach(this.lastNode);
			this.lastNode = null;
		}

		// Dispose observers and children some time in the future
		ricScheduler.mutate(this.disposeObservers.bind(this)).then();
	}

	/**
	 * Disposes all observers
	 */
	private disposeObservers (): void {
		if (this.constructedChildren != null) {
			this.constructedChildren.forEach(child => child.dispose());
			this.constructedChildren = null;
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