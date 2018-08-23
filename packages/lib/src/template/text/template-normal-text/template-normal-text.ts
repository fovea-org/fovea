import {ITemplateNormalText} from "./i-template-normal-text";
import {TemplateNormalTextResult} from "../../template-result/text/template-normal-text-result/template-normal-text-result";
import {ITemplateNormalTextResult} from "../../template-result/text/template-normal-text-result/i-template-normal-text-result";
import {TemplateBase} from "../../template-base/template-base";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";

/**
 * A factory for normal text nodes
 */
export class TemplateNormalText extends TemplateBase implements ITemplateNormalText {

	constructor (public readonly text: string) {
		super();
	}

	/**
	 * Constructs a new Text node
	 * @param {ITemplateConstructOptions} options
	 * @returns {ITemplateNormalTextResult}
	 */
	public construct ({owner, host, root, previousSibling}: ITemplateConstructOptions): ITemplateNormalTextResult {

		// Construct a new TemplateNormalTextResult
		return new TemplateNormalTextResult({host, previousSibling, text: this.text, owner, root});
	}
}