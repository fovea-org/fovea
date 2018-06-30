import {ITemplateResult} from "../../template-result/i-template-result";

export interface ITemplateExpressionTextResult extends ITemplateResult {
	lastNode: Text;
}