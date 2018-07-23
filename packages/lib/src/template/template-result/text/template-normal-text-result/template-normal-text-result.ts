import {TemplateResultBase} from "../../template-result-base/template-result-base";
import {ITemplateNormalTextResult} from "./i-template-normal-text-result";
import {ITemplateNormalTextResultOptions} from "./i-template-normal-text-result-options";

/**
 * A class that reflects an instance of a TemplateNormalTextResult
 */
export class TemplateNormalTextResult extends TemplateResultBase implements ITemplateNormalTextResult {

	/**
	 * A reference to the TextNode within the DOM
	 * @type {Text}
	 */
	public lastNode: Text|null;

	constructor ({host, previousSibling, text, owner, root}: ITemplateNormalTextResultOptions) {
		super({host, previousSibling, owner});

		// Construct a new TextNode
		this.lastNode = document.createTextNode(text);

		// Upgrade it
		this.upgrade(host, this.lastNode, root);

		// Add the node to its owner
		this.attach(this.lastNode, owner);
	}

	/**
	 * Destroys the TemplateNormalTextResult
	 */
	public destroy (): void {
		this.dispose();
	}

	/**
	 * Disposes a TemplateNormalTextResult
	 */
	public dispose (): void {
		if (this.lastNode != null) {
			this.detach(this.lastNode);
			this.lastNode = null;
		}
	}
}