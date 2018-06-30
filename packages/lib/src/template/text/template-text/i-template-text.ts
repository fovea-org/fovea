import {TemplateTextResult} from "../../template-result/template-result/template-text-result";
import {ITemplateBase} from "../../template-base/i-template-base";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";

export interface ITemplateText extends ITemplateBase {
	construct (options: ITemplateConstructOptions): TemplateTextResult;
}