import {ITemplateMultiElementResultOptions} from "./i-template-multi-element-result-options";
import {TemplateResultBase} from "../../template-result-base/template-result-base";
import {ITemplateMultiElementResult} from "./i-template-multi-element-result";
import {TemplateElementResult} from "../../template-result/template-element-result";
import {ITemplateVariables} from "../../../template-variables/i-template-variables";
import {FoveaHost, Optional, ExpressionChain} from "@fovea/common";
import {evaluateExpressionChain} from "../../../../observe/expression-chain/evaluate-expression-chain/evaluate-expression-chain";
import {observeExpressionChain} from "../../../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {Change} from "../../../../observe/observe/change/change";
import {ChangeKind} from "../../../../observe/observe/change-kind/change-kind";
import {TemplateElement} from "../../../element/template-element/template-element";
import {copyTemplateVariables} from "../../../template-variables/copy-template-variables";
import {ITemplateResult} from "../../template-result/i-template-result";
import {constructType} from "../../../../prop/construct-type/construct-type";
import {IObserver} from "../../../../observe/i-observer";
import {rafScheduler} from "@fovea/scheduler";

/*tslint:disable:no-unused-expression*/

/**
 * A class that reflects an instance of a TemplateMultiElement
 */
export class TemplateMultiElementResult<T, U extends Iterable<T> = T[]> extends TemplateResultBase implements ITemplateMultiElementResult {

	/**
	 * Holds the collection of all stamped TemplateElementResults
	 * @type {TemplateElementResult[]}
	 */
	private templateResults?: TemplateElementResult[];

	/**
	 * The observer for the model provided to the TemplateMultiElement
	 * @type {IObserver}
	 */
	private modelObserver?: IObserver;

	/**
	 * The 'indexAs' property flattened to a string
	 * @type {string}
	 */
	private indexAsComputed: string;

	/**
	 * The 'as' property flattened to a string
	 * @type {string}
	 */
	private asComputed: string;

	/**
	 * The computed model target
	 */
	private targetComputed: U;

	/**
	 * The inherited ITemplateVariables of this TemplateMultiElement
	 * @type {ITemplateVariables}
	 */
	private readonly templateVariables?: ITemplateVariables;

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

	/**
	 * The model of the TemplateMultiElement
	 * @type {ExpressionChain}
	 */
	private readonly model: ExpressionChain;

	/**
	 * The 'as' binding of the TemplateMultiElement
	 * @type {ExpressionChain}
	 */
	private readonly as: ExpressionChain;

	/**
	 * The 'indexAs' binding of the TemplateMultiElement
	 * @type {ExpressionChain}
	 */
	private readonly indexAs: ExpressionChain;

	constructor ({host, templateVariables, indexAs, as, model, owner, root, templateElementCtor, base, previousSibling}: ITemplateMultiElementResultOptions) {
		super({host, previousSibling, owner, root});

		// Set the provided templateVariables (if any)
		this.templateVariables = templateVariables;

		// Set the provided TemplateElement constructor
		this.templateElementCtor = templateElementCtor;

		// Set the provided base as the base
		this.base = base;

		this.model = model;
		this.indexAs = indexAs;
		this.as = as;

		// Observe the model
		rafScheduler.mutate(this.observe.bind(this), {instantIfFlushing: true}).then();
	}

	/**
	 * Observes the model and all other related properties
	 */
	private observe (): void {
		if (this.destroyed || this.disposed) return;

		// Compute "indexAs" and "as" once
		this.indexAsComputed = evaluateExpressionChain({host: this.host, templateVariables: this.templateVariables, expressions: this.indexAs, coerceTo: constructType("string")});
		this.asComputed = evaluateExpressionChain({host: this.host, templateVariables: this.templateVariables, expressions: this.as, coerceTo: constructType("string")});

		// Observe the model
		this.modelObserver = observeExpressionChain<U>({
			coerceTo: constructType("any"),
			host: this.host,
			expressions: this.model,
			templateVariables: this.templateVariables,
			onChange: (newValue, change) => this.onModelChanged(newValue, change, this.host, this.owner, this.root)
		});
	}

	/**
	 * Provide an accessor to retrieve the last node of the TemplateResult
	 * @returns {Node | null}
	 */
	public get lastNode (): Node|null {
		if (this.templateResults == null) return null;
		const result = this.templateResults[this.templateResults.length - 1];
		// If there is any TemplateResults, return the lastNode of the last result
		if (result != null) return result.lastNode;

		// Otherwise, return the last node of the previous sibling
		if (this.previousSibling != null) return this.previousSibling.lastNode;
		return null;
	}

	/**
	 * Disposes a TemplateMultiElementResult
	 */
	public destroy (): void {
		this.destroyed = true;
		this.destroyChildren();
		if (this.modelObserver != null) {
			this.modelObserver.unobserve();
			this.modelObserver = undefined;
		}
	}

	/**
	 * Disposes a TemplateMultiElementResult
	 */
	public dispose (): void {
		this.disposed = true;
		this.disposeChildren();
		if (this.modelObserver != null) {
			this.modelObserver.unobserve();
			this.modelObserver = undefined;
		}
	}

	/**
	 * Disposes all TemplateResults
	 */
	private disposeChildren (): void {
		if (this.templateResults == null) return;
		this.templateResults.forEach(templateResult => this.disposeChild(templateResult));
		this.templateResults = undefined;
	}

	/**
	 * Destroys all TemplateResults
	 */
	private destroyChildren (): void {
		if (this.templateResults == null) return;

		this.templateResults.forEach(templateResult => this.destroyChild(templateResult));
		this.templateResults = undefined;
	}

	/**
	 * Disposes the given TemplateResult
	 * @param {TemplateElementResult} child
	 */
	private disposeChild (child: TemplateElementResult): void {
		child.dispose();
	}

	/**
	 * Destroys the given TemplateResult
	 * @param {TemplateElementResult} child
	 */
	private destroyChild (child: TemplateElementResult): void {
		child.destroy();
	}

	/**
	 * Stamps the entire model
	 * @template T
	 * @param {T[]} iterable
	 * @param {FoveaHost} host
	 * @param {Node} owner
	 * @param {ShadowRoot|Element} root
	 */
	private stampAll (iterable: T[], host: FoveaHost, owner: Node, root: ShadowRoot|Element): void {
		let previousSibling: ITemplateResult|null = this.previousSibling;
		iterable.forEach((_, index) => {
			previousSibling = this.stamp(() => iterable[index], index, host, owner, root, previousSibling);
		});
	}

	/**
	 * Stamps an element on the given index
	 * @template T
	 * @param {() => T} item
	 * @param {number} index
	 * @param {FoveaHost} host
	 * @param {Node} owner
	 * @param {ShadowRoot|Element} root
	 * @param {ITemplateResult|null} previousSibling
	 * @returns {TemplateElementResult}
	 */
	private stamp (item: () => T, index: number, host: FoveaHost, owner: Node, root: ShadowRoot|Element, previousSibling: ITemplateResult|null): TemplateElementResult {
		// Check for an existing TemplateResult on the given index
		if (this.templateResults == null) this.templateResults = [];
		const existing = this.templateResults[index];
		// If it exists, destroy it
		if (existing != null) {
			this.destroyChild(existing);
		}

		// Don't wrap the computed key in the closure
		const asComputed = this.asComputed;

		// Construct a new one and set in on the given index
		const result = this.templateElementCtor()
			.construct({
				host, owner, root, base: this.base,
				previousSibling,
				templateVariables: {
					...copyTemplateVariables(this.templateVariables),
					[this.indexAsComputed]: index,
					get [asComputed] () {
						return item();
					}
				}
			});
		this.templateResults[index] = result;
		return result;
	}

	/**
	 * Pops the last TemplateResult
	 */
	private pop (): void {
		if (this.templateResults == null) return;
		const lastTemplateResult = this.templateResults.pop();
		if (lastTemplateResult != null) {
			lastTemplateResult.destroy();
		}
	}

	/**
	 * Invoked when the Model changes
	 * @template U
	 * @param {Optional<U>} newValue
	 * @param {Change<U>} [change]
	 * @param {FoveaHost} host
	 * @param {Node} owner
	 * @param {ShadowRoot} root
	 */
	private onModelChanged (newValue: Optional<U>, change: Change<U>|undefined, host: FoveaHost, owner: Node, root: ShadowRoot|Element): void {

		// Don't proceed if we already have that exact reference stamped out and there's no changes to report
		const isIdenticalToCurrentModel = change == null && this.targetComputed != null && newValue != null && newValue === this.targetComputed;
		if (isIdenticalToCurrentModel) return;

		// If the new value is null, destroy all children
		if (newValue == null) {
			return this.destroyChildren();
		}

		if (change == null) {
			this.targetComputed = newValue;
		}

		// If there is a change, but it is on the computed model target, return immediately
		else if (change.target !== this.targetComputed) {
			return;
		}

		// Normalize the iterable as an array
		const iterable = Array.isArray(newValue) ? newValue : Array.from(newValue);

		// If the length is equal to zero, destroy all children
		if (iterable.length === 0) {
			return this.destroyChildren();
		}

		// If no change is provided, this is the initial render. Stamp it
		if (change == null) {
			return this.stampAll(iterable, host, owner, root);
		}

		// Otherwise, switch through the change kind
		switch (change.kind) {
			case ChangeKind.POP:
				return this.pop();

			case ChangeKind.SPLICE:
				this.stamp(() => iterable[change.property], change.property, host, owner, root, this.findPreviousSiblingForIndex(change.property));
				break;
		}
	}

	/**
	 * Finds the previous sibling for the given index
	 * @param {number} index
	 * @returns {ITemplateResult | null}
	 */
	private findPreviousSiblingForIndex (index: number): ITemplateResult|null {
		if (this.templateResults == null) return null;
		let currentIndex = index - 1;

		while (currentIndex > 0) {
			const templateResult = this.templateResults[currentIndex];
			if (templateResult != null) return templateResult;
			currentIndex--;
		}
		return this.previousSibling;
	}
}