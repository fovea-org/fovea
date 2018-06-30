import {TemplateNormalText} from "../../../template/text/template-normal-text/template-normal-text";
import {ITemplateNormalText} from "../../../template/text/template-normal-text/i-template-normal-text";

/**
 * Creates a new ITemplateNormalText
 * @param {string} data
 * @returns {ITemplateNormalText}
 */
export function __createTextNode (data: string): ITemplateNormalText {
	return new TemplateNormalText(data);
}