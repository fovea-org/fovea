import {ITemplateBase} from "./i-template-base";
import {ITemplateResult} from "../template-result/template-result/i-template-result";
import {ITemplateConstructOptions} from "../template-construct-options/i-template-construct-options";

/**
 * The base Template that all other Templates inherits from
 */
export abstract class TemplateBase implements ITemplateBase {

	/**
	 * Constructs a new Template
	 * @param {ITemplateConstructOptions} options
	 * @returns {ITemplateResult}
	 */
	public abstract construct (options: ITemplateConstructOptions): ITemplateResult;
}