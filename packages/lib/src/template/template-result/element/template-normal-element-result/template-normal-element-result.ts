import {Json} from "@fovea/common";
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

/*tslint:disable:no-unused-expression*/

/**
 * A class that reflects an instance of a TemplateNormalElement
 */
export class TemplateNormalElementResult extends TemplateResultBase implements ITemplateNormalElementResult {

	/**
	 * The instantiated element within the DOM
	 * @type {Element}
	 */
	public lastNode: Element;

	/*# IF hasTemplateAttributes */

	/**
	 * The expression observers that, when changed, should mutate the elements attributes
	 * @type {IExpressionChainObserver[]}
	 */
	private readonly attributeObservers: IExpressionChainObserver[];

	/**
	 * The expression observers that, when changed, should mutate the elements properties
	 * @type {IExpressionChainObserver[]}
	 */
	private readonly propertyObservers: IExpressionChainObserver[]; /*# END IF hasTemplateAttributes */

	/*# IF hasICustomAttributes */

	/**
	 * The expression observers that, when changed, should set the 'value' property on the Custom Attributes that are set on this element
	 */
	private readonly customAttributeObservers: IExpressionChainObserver[]; /*# END IF hasICustomAttributes */

	/*# IF hasTemplateListeners */

	/**
	 * The expression observers that, when changed, should mutate the elements listeners
	 * @type {IExpressionChainObserver[]}
	 */
	private readonly listenerObservers: IExpressionChainObserver[]; /*# END IF hasTemplateListeners */

	/*# IF hasTemplateRefs */

	/**
	 * The observer for a bound ref to the host
	 * @type {IObserver}
	 */
	private readonly refObserver: IObserver; /*# END IF hasTemplateRefs */

	/**
	 * All constructed children of this element
	 * @type {TemplateResult[]}
	 */
	private readonly constructedChildren: TemplateResult[] = [];

	constructor ({/*# IF hasTemplateRefs */ref, /*# END IF hasTemplateRefs */ /*# IF hasTemplateAttributes */ attributes, properties, /*# END IF hasTemplateAttributes */ /*# IF hasTemplateListeners */ listeners, /*# END IF hasTemplateListeners */ host, /*# IF hasTemplateCustomAttributes */ customAttributes, /*# END IF hasTemplateCustomAttributes */ templateVariables, previousSibling, lastNode, owner, root, children}: ITemplateNormalElementResultOptions) {
		super({host, previousSibling, owner});

		this.lastNode = lastNode;

		// Upgrade it
		this.upgrade(host, this.lastNode, root);


		// Construct and append all children
		let previousSiblingForChild: ITemplateResult|null;
		children.forEach(child => {
			previousSiblingForChild = child.construct({host, owner: lastNode, root, templateVariables, previousSibling: previousSiblingForChild});
			this.constructedChildren.push(previousSiblingForChild);
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
	 * Disposes an element
	 */
	public dispose (): void {
		this.detach(this.lastNode);
		this.constructedChildren.forEach(child => child.dispose());

		/*# IF hasTemplateCustomAttributes */

		// Stop observing Custom Attribute expressions
		this.customAttributeObservers.forEach(observer => observer.unobserve()); /*# END IF hasTemplateCustomAttributes */

		/*# IF hasTemplateAttributes */

		// Stop observing attribute expressions
		this.attributeObservers.forEach(observer => observer.unobserve());
		// Stop observing property expressions
		this.propertyObservers.forEach(observer => observer.unobserve()); /*# END IF hasTemplateAttributes */

		/*# IF hasTemplateListeners */

		// Stop observing listener expressions
		this.listenerObservers.forEach(observer => observer.unobserve()); /*# END IF hasTemplateListeners */

		// Mark for garbage collection

		/*# IF hasTemplateCustomAttributes */
		(<Json>this.customAttributeObservers) = null; /*# END IF hasTemplateCustomAttributes */

		/*# IF hasTemplateAttributes */
		(<Json>this.attributeObservers) = null;
		(<Json>this.propertyObservers) = null; /*# END IF hasTemplateAttributes */

		/*# IF hasTemplateListeners */
		(<Json>this.listenerObservers) = null; /*# END IF hasTemplateListeners */

		(<Json>this.lastNode) = null;

		/*# IF hasTemplateRefs */
		if (this.refObserver != null) {
			this.refObserver.unobserve();
			(<Json>this.refObserver) = null;
		} /*# END IF hasTemplateRefs */
	}
}