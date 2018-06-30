import {ITemplateConstructOptions} from "../template-construct-options/i-template-construct-options";
import {ITemplateResult} from "../template-result/template-result/i-template-result";

export interface ITemplateBase {
	construct (options: ITemplateConstructOptions): ITemplateResult;
}