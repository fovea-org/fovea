import {ITemplateText} from "../template-text/i-template-text";
import {ExpressionChain} from "@fovea/common";
import {ITemplateExpressionTextResult} from "../../template-result/text/template-expression-text-result/i-template-expression-text-result";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";

export interface ITemplateExpressionText extends ITemplateText {
	expressionChain: ExpressionChain;
	construct (options: ITemplateConstructOptions): ITemplateExpressionTextResult;
}