import {ITemplateProperty} from "../../../template-property/i-template-property";
import {ITemplateListener} from "../../../template-listener/i-template-listener";
import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHostConstructor, isExpression, Json, Optional, ExpressionChain} from "@fovea/common";
import {ITemplateNormalElementResultOptions} from "./i-template-normal-element-result-options";
import {TemplateResultBase} from "../../template-result-base/template-result-base";
import {observeExpressionChain} from "../../../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {IExpressionChainObserver} from "../../../../observe/expression-chain/expression-chain-observer/i-expression-chain-observer";
import {ITemplateNormalElementResult} from "./i-template-normal-element-result";
import {setAttribute} from "../../../../attribute/set-attribute/set-attribute";
import {evaluateExpressionChain} from "../../../../observe/expression-chain/evaluate-expression-chain/evaluate-expression-chain";
import {IListenResult} from "../../../../listen/i-listen-result";
import {EvaluateExpressionChainResult} from "../../../../observe/expression-chain/evaluate-expression-chain/i-evaluate-expression-chain-result";
import {listen} from "../../../../listen/listen";
import {upgradeExpressionChain} from "../../../../observe/expression-chain/upgrade-expression-chain/upgrade-expression-chain";
import {copyTemplateVariables} from "../../../template-variables/copy-template-variables";
import {UpgradedExpressionChain} from "../../../../observe/expression-chain/upgraded-expression-chain/upgraded-expression-chain";
import {ITemplateVariables} from "../../../template-variables/i-template-variables";
import {constructCustomAttribute} from "../../../../custom-attribute/construct-custom-attribute";
import {ITemplateResult} from "../../template-result/i-template-result";
import {TemplateResult} from "../../template-result/template-result";
import {IExpressionChainDict} from "../../../../observe/expression-chain/i-expression-chain-dict";
import {getTypeForPropName, isAnyType, isBooleanType} from "../../../../prop/type-for-prop-name/get-type-for-prop-name";
import {getPropNameForAttributeName} from "../../../../prop/prop-name-to-attribute-name/get-prop-name-for-attribute-name/get-prop-name-for-attribute-name";
import {constructType} from "../../../../prop/construct-type/construct-type";

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
	private readonly customAttributeObservers: IExpressionChainObserver[];

	/**
	 * All Custom Attributes that has been constructed
	 */
	private readonly constructedCustomAttributes: {customAttribute: ICustomAttribute; valueExpression: IExpressionChainDict; dispose (): void}[]; /*# END IF hasICustomAttributes */

	/*# IF hasTemplateListeners */

	/**
	 * The expression observers that, when changed, should mutate the elements listeners
	 * @type {IExpressionChainObserver[]}
	 */
	private readonly listenerObservers: IExpressionChainObserver[]; /*# END IF hasTemplateListeners */

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

		// Construct all of the Custom Attributes
		this.constructedCustomAttributes = customAttributes.map(customAttribute => ({
			...constructCustomAttribute(lastNode, customAttribute.key),
			valueExpression: customAttribute.value
		})); /*# END IF hasTemplateCustomAttributes */

		// Add the node to its owner
		this.attach(this.lastNode, owner);

		/*# IF hasTemplateRefs */

		// If a ref is given, bind the ref to the host, prepended with a '$'
		if (ref != null) {
			(<Json>this).host[`$${ref}`] = lastNode;
		} /*# END IF hasTemplateRefs */

		/*# IF hasTemplateCustomAttributes */

		// Observe all values of all Custom Attributes
		this.customAttributeObservers = [].concat.apply([], this.constructedCustomAttributes.map(({valueExpression, customAttribute}) => {
			return Object.entries(valueExpression).map(([propertyName, chain]) => {
				const type = getTypeForPropName(<ICustomAttributeConstructor> customAttribute.constructor, propertyName);
				return observeExpressionChain({
					coerceTo: type,
					host,
					expressions: chain,
					templateVariables,
					onChange: newValue => this.onCustomAttributeValueShouldUpdate(customAttribute, {key: propertyName, value: chain}, newValue)
				});
			});
		})); /*# END IF hasTemplateCustomAttributes */

		/*# IF hasTemplateAttributes */

		// Observe all attributes
		this.attributeObservers = [].concat.apply([], attributes.map(attribute => {

			const observe = (propertyName: string, expressionChain: ExpressionChain|undefined, append: boolean) => {
				const type = propertyName === "style"
					// If the property is a style attribute, the value will always be a string
					? constructType("string")
					: propertyName === "class"
						// If the property is a class attribute, the value will always be boolean (to toggle the class on/off)
						? constructType("boolean")
						// Otherwise, attempt to take the type of whatever prop the attribute maps to (if any)
						: getTypeForPropName(<IFoveaHostConstructor>this.lastNode.constructor, getPropNameForAttributeName(propertyName));

				return observeExpressionChain<string|boolean>({
					coerceTo: type,
					host,
					// If no value is given, provide the empty string as value
					expressions: expressionChain != null ? expressionChain : [""],
					templateVariables,
					onChange: newValue => this.onAttributeShouldUpdate(attribute, newValue, isAnyType(type) && typeof newValue === "boolean" ? true : isBooleanType(type), !append ? undefined : propertyName)
				});
			};

			if (attribute.value == null || Array.isArray(attribute.value)) {
				return [observe(attribute.key, attribute.value, false)];
			}

			else {
				return Object.entries(attribute.value).map(([propertyName, chain]) => observe(propertyName, chain, true));
			}
		}));

		// Observe all properties
		this.propertyObservers = [].concat.apply([], properties.map(property => {

			const observe = (propertyName: string, expressionChain: ExpressionChain|undefined) => {
				const type = getTypeForPropName(<IFoveaHostConstructor>this.lastNode.constructor, propertyName);
				return observeExpressionChain<string>({
					coerceTo: type,
					host,
					// If no value is given, provide the empty string as value
					expressions: expressionChain != null ? expressionChain : [""],
					templateVariables,
					onChange: newValue => this.onPropertyShouldUpdate(property, newValue)
				});
			};

			if (property.value == null || Array.isArray(property.value)) {
				return [observe(property.key, property.value)];
			}

			else {
				return Object.entries(property.value).map(([propertyName, chain]) => observe(propertyName, chain));
			}
		})); /*# END IF hasTemplateAttributes */

		/*# IF hasTemplateListeners */

		// Set all listeners (asynchronously)
		this.listenerObservers = listeners.map(listener => {
			let upgradedExpressionChain: UpgradedExpressionChain|null = null;
			let variables: ITemplateVariables|null = null;

			// Invokes the provided event handler. Performs as much work lazily as possible
			const invoke = (event: Event): EvaluateExpressionChainResult => {
				if (upgradedExpressionChain == null) upgradedExpressionChain = upgradeExpressionChain(listener.handler, constructType("function"));
				if (variables == null) variables = copyTemplateVariables(templateVariables);

				variables.event = event;

				return evaluateExpressionChain(host, upgradedExpressionChain, variables);
			};

			return this.onListenerHandlerShouldUpdate(listener, invoke);
		}); /*# END IF hasTemplateListeners */
	}

	/**
	 * Disposes an element
	 */
	public dispose (): void {
		this.detach(this.lastNode);
		this.constructedChildren.forEach(child => child.dispose());

		/*# IF hasTemplateCustomAttributes */

		// Stop observing Custom Attribute expressions
		this.customAttributeObservers.forEach(observer => observer.unobserve());
		this.constructedCustomAttributes.forEach(customAttribute => customAttribute.dispose()); /*# END IF hasTemplateCustomAttributes */

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
	}

	/*# IF hasTemplateListeners */

	/**
	 * Invoked when a listener handler changes
	 * @param {ITemplateListener} listener
	 * @param {() => IEvaluateExpressionChainResult} newHandler
	 */
	protected onListenerHandlerShouldUpdate (listener: ITemplateListener, newHandler: (e: Event, name: string) => EvaluateExpressionChainResult): IListenResult {
		// Check if it includes at least one expression
		const containsExpression = listener.handler.some(part => isExpression(part));
		return listen({on: this.lastNode, host: this.host, once: false, handler: containsExpression ? newHandler : (<Json>newHandler)(), name: listener.name});
	} /*# END IF hasTemplateListeners */

	/*# IF hasTemplateCustomAttributes */

	/**
	 * Invoked when the value of a CustomAttribute should change
	 * @param {ICustomAttribute} customAttribute
	 * @param {ITemplateProperty} property
	 * @param {ITemplateProperty} newValue
	 * @param {Optional<T>} newValue
	 */
	protected onCustomAttributeValueShouldUpdate<T> (customAttribute: ICustomAttribute, property: ITemplateProperty, newValue: Optional<T>): void {
		const normalizedKey = property.key;
		const oldValue = (<Json>customAttribute)[normalizedKey];

		// If it didn't change, return immediately
		if (newValue === oldValue) return;

		// Set the new value
		(<Json>customAttribute)[normalizedKey] = newValue;
	} /*# END IF hasTemplateCustomAttributes */

	/*# IF hasTemplateAttributes */

	/**
	 * Invoked when an attribute should change
	 * @param {ITemplateProperty} attribute
	 * @param {Optional<string|boolean>} newValue
	 * @param {string?} setForValueProperty
	 * @param {boolean} isBoolean
	 */
	protected onAttributeShouldUpdate (attribute: ITemplateProperty, newValue: Optional<string|boolean>, isBoolean: boolean, setForValueProperty: string|undefined): void {
		setAttribute(this.host, this.lastNode, attribute.key, newValue, isBoolean, setForValueProperty);
	}

	/**
	 * Invoked when a property should change
	 * @param {ITemplateProperty} property
	 * @param {Optional<T>} newValue
	 */
	protected onPropertyShouldUpdate<T> (property: ITemplateProperty, newValue: Optional<T>): void {

		const normalizedKey = <keyof Element> property.key;
		const oldValue = (<Json>this.lastNode)[normalizedKey];

		// If it didn't change, return immediately
		if (newValue === oldValue) return;

		// Set the new value
		(<Json>this.lastNode)[normalizedKey] = newValue;
	} /*# END IF hasTemplateAttributes */
}