import {TemplateResultBase} from "../../template-result-base/template-result-base";
import {ITemplateConditionalElementResult} from "./i-template-conditional-element-result";
import {TemplateElementResult} from "../../template-result/template-element-result";
import {observeExpressionChain} from "../../../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {ITemplateVariables} from "../../../template-variables/i-template-variables";
import {TemplateElement} from "../../../element/template-element/template-element";
import {FoveaHost, Optional, ExpressionChain} from "@fovea/common";
import {ITemplateConditionalElementResultOptions} from "./i-template-conditional-element-result-options";
import {constructType} from "../../../../prop/construct-type/construct-type";
import {IObserver} from "../../../../observe/i-observer";
import {rafScheduler} from "@fovea/scheduler";

/**
 * A class that reflects an instance of a TemplateConditionalElement
 */
export class TemplateConditionalElementResult extends TemplateResultBase implements ITemplateConditionalElementResult {
	/**
	 * The (potentially) stamped model of the Conditional Element
	 * @type {TemplateElementResult|null}
	 */
	private templateResult: TemplateElementResult|null = null;

	/**
	 * The old condition value
	 * @type {null}
	 */
	private oldValue: Optional<boolean> = null;

	/**
	 * The observer for the provided condition
	 * @type {IObserver}
	 */
	private conditionObserver?: IObserver;

	/**
	 * The inherited ITemplateVariables of this TemplateConditionalElement
	 * @type {ITemplateVariables}
	 */
	private readonly templateVariables?: ITemplateVariables;

	/**
	 * The condition that must be true to stamp the TemplateConditionalElement
	 * @type {ExpressionChain}
	 */
	private readonly condition: ExpressionChain;

	/**
	 * A wrapper function to invoke to retrieve a new TemplateElement
	 * @type {Function}
	 */
	private readonly templateElementCtor: () => TemplateElement;

	/**
	 * The base with which to merge children
	 * @type {TemplateElement}
	 */
	private readonly base: TemplateElement;

	constructor ({host, templateVariables, condition, owner, root, templateElementCtor, base, previousSibling}: ITemplateConditionalElementResultOptions) {
		super({host, previousSibling, owner, root});

		// Set the provided templateVariables (if any)
		this.templateVariables = templateVariables;

		// Set the provided TemplateElement constructor
		this.templateElementCtor = templateElementCtor;

		// Set the provided base as the base
		this.base = base;
		this.condition = condition;

		// Observe the model
		rafScheduler.mutate(this.observe.bind(this), {instantIfFlushing: true}).then();
	}

	/**
	 * Observes the model
	 */
	private observe (): void {
		if (this.destroyed || this.disposed) return;

		// Observe the model
		this.conditionObserver = observeExpressionChain<boolean>({
			coerceTo: constructType("boolean"),
			host: this.host,
			expressions: this.condition,
			templateVariables: this.templateVariables,
			onChange: newValue => this.onConditionChanged(newValue, this.host, this.owner, this.root)
		});
	}

	/**
	 * Provide an accessor to retrieve the last node of the TemplateResult
	 * @returns {Node | null}
	 */
	public get lastNode (): Node|null {
		// If there is a TemplateResult, return the last node of it
		if (this.templateResult != null) return this.templateResult.lastNode;
		// Otherwise, return the last node of the previous sibling
		if (this.previousSibling != null) return this.previousSibling.lastNode;
		return null;
	}

	/**
	 * Destroys a TemplateConditionalElement
	 */
	public destroy (): void {
		this.destroyed = true;
		this.destroyTemplate();
		if (this.conditionObserver != null) {
			this.conditionObserver.unobserve();
			this.conditionObserver = undefined;
		}
	}

	/**
	 * Disposes a TemplateConditionalElement
	 */
	public dispose (): void {
		this.disposed = true;
		this.disposeTemplate();
		if (this.conditionObserver != null) {
			this.conditionObserver.unobserve();
			this.conditionObserver = undefined;
		}
	}

	/**
	 * Destroys a Template
	 */
	private destroyTemplate (): void {
		if (this.templateResult == null) return;
		this.templateResult.destroy();
		this.templateResult = null;
	}

	/**
	 * Disposes the bound TemplateResult (if it has any)
	 */
	private disposeTemplate (): void {
		if (this.templateResult == null) return;
		this.templateResult.dispose();
		this.templateResult = null;
	}

	/**
	 * Invoked when the Condition changes
	 * @param {Optional<boolean>} newValue
	 * @param {FoveaHost} host
	 * @param {Node} owner
	 * @param {ShadowRoot|Element} root
	 */
	private onConditionChanged (newValue: Optional<boolean>, host: FoveaHost, owner: Node, root: ShadowRoot|Element): void {
		// If it didn't change, return immediately
		if (newValue === this.oldValue) return;

		this.oldValue = newValue;

		// If the new value is null, destroy the template
		if (newValue == null || !newValue) {
			this.destroyTemplate();
		}

		// Otherwise, render a new TemplateResult
		else {
			this.templateResult = this.templateElementCtor()
				.construct({host, owner, root, templateVariables: this.templateVariables, base: this.base, previousSibling: this.previousSibling});
		}
	}
}