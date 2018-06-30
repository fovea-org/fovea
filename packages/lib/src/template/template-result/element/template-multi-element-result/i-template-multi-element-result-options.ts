import {ITemplateResultOptions} from "../../template-result/i-template-result-options";
import {ITemplateVariables} from "../../../template-variables/i-template-variables";
import {ExpressionChain} from "@fovea/common";
import {TemplateElement} from "../../../element/template-element/template-element";

export interface ITemplateMultiElementResultOptions extends ITemplateResultOptions {
	templateVariables?: ITemplateVariables;
	model: ExpressionChain;
	as: ExpressionChain;
	indexAs: ExpressionChain;
	owner: Node;
	root: ShadowRoot|Element;
	base: TemplateElement;
	templateElementCtor (): TemplateElement;
}