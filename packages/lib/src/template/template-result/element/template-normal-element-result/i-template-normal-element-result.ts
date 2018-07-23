import {ITemplateResult} from "../../template-result/i-template-result";

export interface ITemplateNormalElementResult extends ITemplateResult {
	lastNode: Element|null;
}