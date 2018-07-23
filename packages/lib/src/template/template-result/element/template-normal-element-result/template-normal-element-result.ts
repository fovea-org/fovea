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

	/*# IF hasTemplateAttributes */

	/**
	 * The expression observers that, when changed, should mutate the elements attributes
	 * @type {IExpressionChainObserver[]}
	 */
	private attributeObservers: IExpressionChainObserver[]|null;

	/**
	 * The expression observers that, when changed, should mutate the elements properties
	 * @type {IExpressionChainObserver[]}
	 */
	private propertyObservers: IExpressionChainObserver[]|null; /*# END IF hasTemplateAttributes */

	/*# IF hasICustomAttributes */

	/**
	 * The expression observers that, when changed, should set the 'value' property on the Custom Attributes that are set on this element
	 */
	private customAttributeObservers: (IObserver & IDestroyable)[]|null; /*# END IF hasICustomAttributes */

	/*# IF hasTemplateListeners */

	/**
	 * The expression observers that, when changed, should mutate the elements listeners
	 * @type {IExpressionChainObserver[]}
	 */
	private listenerObservers: IExpressionChainObserver[]|null; /*# END IF hasTemplateListeners */

	/*# IF hasTemplateRefs */

	/**
	 * The observer for a bound ref to the host
	 * @type {IObserver}
	 */
	private refObserver: IObserver|null; /*# END IF hasTemplateRefs */

	/**
	 * All constructed children of this element
	 * @type {TemplateResult[]}
	 */
	private constructedChildren: TemplateResult[]|null = [];

	constructor ({/*# IF hasTemplateRefs */ref, /*# END IF hasTemplateRefs */ /*# IF hasTemplateAttributes */ attributes, properties, /*# END IF hasTemplateAttributes */ /*# IF hasTemplateListeners */ listeners, /*# END IF hasTemplateListeners */ host, /*# IF hasTemplateCustomAttributes */ customAttributes, /*# END IF hasTemplateCustomAttributes */ templateVariables, previousSibling, lastNode, owner, root, children}: ITemplateNormalElementResultOptions) {
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

		/*# IF hasTemplateCustomAttributes */

		this.customAttributeObservers = customAttributes.map(customAttribute => attachCustomAttribute(host, lastNode, customAttribute.key, customAttribute.value, templateVariables)); /*# END IF hasTemplateCustomAttributes */

		// Add the node to its owner
		this.attach(this.lastNode, owner);

		/*# IF hasTemplateRefs */

		// If a ref is given, bind the ref to the host, prepended with a '$'
		if (ref != null) {
			this.refObserver = addRef(host, lastNode, ref);
		} /*# END IF hasTemplateRefs */

		/*# IF hasTemplateAttributes */

		// Observe all attributes
		this.attributeObservers = attributes.map(attribute => observeAttribute(host, lastNode, attribute, templateVariables));

		// Observe all properties
		this.propertyObservers = properties.map(property => observeProperty(host, lastNode, property, templateVariables)); /*# END IF hasTemplateAttributes */

		/*# IF hasTemplateListeners */

		// Set all listeners
		this.listenerObservers = listeners.map(listener => observeListener(host, lastNode, listener, templateVariables)); /*# END IF hasTemplateListeners */
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

		/*# IF hasTemplateCustomAttributes */

		// Stop observing Custom Attribute expressions
		if (this.customAttributeObservers != null) {
			this.customAttributeObservers.forEach(observer => observer.destroy());
			this.customAttributeObservers = null;
		} /*# END IF hasTemplateCustomAttributes */

		this.disposeOrDestroyCommon();
	}

	/**
	 * Common functionality across destroying and disposing
	 */
	private disposeOrDestroyCommon (): void {
		/*# IF hasTemplateAttributes */

		// Stop observing attribute expressions
		if (this.attributeObservers != null) {
			this.attributeObservers.forEach(observer => observer.unobserve());
			this.attributeObservers = null;
		}
		// Stop observing property expressions
		if (this.propertyObservers != null) {
			this.propertyObservers.forEach(observer => observer.unobserve());
			this.propertyObservers = null;
		} /*# END IF hasTemplateAttributes */

		/*# IF hasTemplateListeners */

		// Stop observing listener expressions
		if (this.listenerObservers != null) {
			this.listenerObservers.forEach(observer => observer.unobserve());
			this.listenerObservers = null;
		} /*# END IF hasTemplateListeners */

		/*# IF hasTemplateRefs */
		if (this.refObserver != null) {
			this.refObserver.unobserve();
			this.refObserver = null;
		} /*# END IF hasTemplateRefs */
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

		/*# IF hasTemplateCustomAttributes */

		// Stop observing Custom Attribute expressions
		if (this.customAttributeObservers != null) {
			this.customAttributeObservers.forEach(observer => observer.unobserve());
			this.customAttributeObservers = null;
		} /*# END IF hasTemplateCustomAttributes */

		this.disposeOrDestroyCommon();
	}
}