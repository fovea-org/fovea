import {ITemplateElement} from "../template-element/i-template-element";
import {ITemplateConditionalElementConstructOptions} from "./i-template-conditional-element-construct-options";
import {ITemplateConditionalElementResult} from "../../template-result/element/template-conditional-element-result/i-template-conditional-element-result";

export interface ITemplateConditionalElement extends ITemplateElement {
	construct (options: ITemplateConditionalElementConstructOptions): ITemplateConditionalElementResult;
}