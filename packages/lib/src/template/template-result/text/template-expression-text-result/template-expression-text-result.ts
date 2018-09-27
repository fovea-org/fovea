import {TemplateResultBase} from "../../template-result-base/template-result-base";
import {ITemplateExpressionTextResult} from "./i-template-expression-text-result";
import {ITemplateExpressionTextResultOptions} from "./i-template-expression-text-result-options";
import {observeExpressionChain} from "../../../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {Optional, ExpressionChain} from "@fovea/common";
import {constructType} from "../../../../prop/construct-type/construct-type";
import {rafScheduler} from "@fovea/scheduler";
import {IObserver} from "../../../../observe/i-observer";
import {ITemplateVariables} from "../../../template-variables/i-template-variables";

/**
 * A class that reflects an instance of a TemplateExpressionTextResult
 */
export class TemplateExpressionTextResult extends TemplateResultBase implements ITemplateExpressionTextResult {

	/**
	 * A reference to the TextNode within the DOM
	 * @type {Text}
	 */
	public lastNode: Text|null;

	/**
	 * A reference to the TextNode within the DOM
	 * @type {ExpressionChain}
	 */
	private readonly expressionChain: ExpressionChain;

	/**
	 * The expression observer that, when changed, should mutate the textContent of the TextNode
	 * @type {IObserver}
	 */
	private expressionObserver?: IObserver;

	/**
	 * The inherited ITemplateVariables of this TemplateMultiElement
	 * @type {ITemplateVariables}
	 */
	private readonly templateVariables?: ITemplateVariables;

	constructor ({host, expressionChain, templateVariables, previousSibling, owner, root}: ITemplateExpressionTextResultOptions) {
		super({host, previousSibling, owner, root});

		// Construct a new TextNode
		this.lastNode = document.createTextNode("");

		// Add the node to its owner
		this.attach(this.lastNode, owner);

		this.expressionChain = expressionChain;
		this.templateVariables = templateVariables;

		// Observe the model
		rafScheduler.mutate(this.observe.bind(this), {instantIfFlushing: true}).then();
	}

	/**
	 * Observes the expression
	 */
	private observe (): void {
		if (this.destroyed || this.disposed) return;

		// Observe the expression
		this.expressionObserver = observeExpressionChain<string>({
			coerceTo: constructType("string"),
			host: this.host,
			expressions: this.expressionChain,
			templateVariables: this.templateVariables,
			onChange: this.onExpressionChanged.bind(this)
		});
	}

	/**
	 * Destroys the TemplateExpressionTextResult
	 */
	public destroy (): void {
		this.dispose();
	}

	/**
	 * Disposes a TemplateExpressionTextResult
	 */
	public dispose (): void {
		if (this.lastNode != null) {
			this.detach(this.lastNode);
			this.lastNode = null;
		}

		// Stop observing the expression
		if (this.expressionObserver != null) {
			this.expressionObserver.unobserve();
			this.expressionObserver = undefined;
		}
	}

	/**
	 * Called when the observed expression changes
	 * @param {Optional<string>} newValue
	 */
	private onExpressionChanged (newValue: Optional<string>): void {
		rafScheduler.mutate(this.updateTextContent.bind(this, newValue), {instantIfFlushing: true}).then();
	}

	/**
	 * Updates the Text content
	 * @param {Optional<string>} newValue
	 */
	private updateTextContent (newValue: Optional<string>): void {
		if (this.lastNode == null) return;
		this.lastNode.textContent = newValue == null ? null : newValue;
	}
}