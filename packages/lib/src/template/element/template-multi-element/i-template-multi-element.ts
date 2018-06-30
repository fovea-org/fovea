import {ITemplateElement} from "../template-element/i-template-element";
import {ITemplateMultiElementConstructOptions} from "./i-template-multi-element-construct-options";
import {ITemplateMultiElementResult} from "../../template-result/element/template-multi-element-result/i-template-multi-element-result";

export interface ITemplateMultiElement extends ITemplateElement {
	construct (options: ITemplateMultiElementConstructOptions): ITemplateMultiElementResult;
}