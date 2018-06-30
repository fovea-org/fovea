import {ITemplateResult} from "../../template-result/i-template-result";

export interface ITemplateConditionalElementResult extends ITemplateResult {
	lastNode: Node|null;
}