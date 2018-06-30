import {ITemplateText} from "../template-text/i-template-text";
import {ITemplateNormalTextResult} from "../../template-result/text/template-normal-text-result/i-template-normal-text-result";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";

export interface ITemplateNormalText extends ITemplateText {
	text: string;
	construct (options: ITemplateConstructOptions): ITemplateNormalTextResult;
}