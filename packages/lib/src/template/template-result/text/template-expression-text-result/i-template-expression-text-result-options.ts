import {ITemplateResultOptions} from "../../template-result/i-template-result-options";
import {Expression} from "@fovea/common";
import {ITemplateVariables} from "../../../template-variables/i-template-variables";
import {ITemplateResult} from "../../template-result/i-template-result";

export interface ITemplateExpressionTextResultOptions extends ITemplateResultOptions {
	owner: Node;
	root: ShadowRoot|Element;
	previousSibling: ITemplateResult|null;
	expression: Expression;
	templateVariables?: ITemplateVariables;
}