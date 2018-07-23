import {ITemplateResult} from "../../template-result/i-template-result";

export interface ITemplateNormalTextResult extends ITemplateResult {
	lastNode: Text|null;
}