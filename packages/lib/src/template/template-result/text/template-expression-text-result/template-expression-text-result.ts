import {TemplateResultBase} from "../../template-result-base/template-result-base";
import {ITemplateExpressionTextResult} from "./i-template-expression-text-result";
import {ITemplateExpressionTextResultOptions} from "./i-template-expression-text-result-options";
import {IExpressionChainObserver} from "../../../../observe/expression-chain/expression-chain-observer/i-expression-chain-observer";
import {observeExpressionChain} from "../../../../observe/expression-chain/observe-expression-chain/observe-expression-chain";
import {Json, Optional} from "@fovea/common";
import {constructType} from "../../../../prop/construct-type/construct-type";

/**
 * A class that reflects an instance of a TemplateExpressionTextResult
 */
export class TemplateExpressionTextResult extends TemplateResultBase implements ITemplateExpressionTextResult {

	/**
	 * The expression observer that, when changed, should mutate the textContent of the TextNode
	 * @type {IExpressionChainObserver}
	 */
	private readonly expressionObserver: IExpressionChainObserver;

	/**
	 * A reference to the TextNode within the DOM
	 * @type {Text}
	 */
	public lastNode: Text;

	constructor ({host, expression, templateVariables, previousSibling, owner, root}: ITemplateExpressionTextResultOptions) {
		super({host, previousSibling, owner});

		// Construct a new TextNode
		this.lastNode = document.createTextNode("");

		// Upgrade it
		this.upgrade(host, this.lastNode, root);

		// Add the node to its owner
		this.attach(this.lastNode, owner);

		// Observe the expression if it has a parent
		this.expressionObserver = observeExpressionChain<string>({
			coerceTo: constructType("string"),
			host,
			expressions: [expression],
			templateVariables,
			onChange: newValue => this.onExpressionChanged(newValue)
		});
	}

	/**
	 * Disposes a TemplateExpressionTextResult
	 */
	public dispose (): void {
		this.detach(this.lastNode);

		// Stop observing the expression
		this.expressionObserver.unobserve();

		// Mark for garbage collection
		(<Json>this.expressionObserver) = null;
	}

	/**
	 * Called when the observed expression changes
	 * @param {Optional<string>} newValue
	 */
	private onExpressionChanged (newValue: Optional<string>): void {
		this.lastNode.textContent = newValue == null ? null : newValue;
	}
}