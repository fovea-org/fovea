import {ITemplateResult} from "../../template-result/i-template-result";

export interface ITemplateMultiElementResult extends ITemplateResult {
	lastNode: Node|null;
}