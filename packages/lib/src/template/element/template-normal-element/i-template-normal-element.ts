import {ITemplateElement} from "../template-element/i-template-element";
import {ITemplateNormalElementResult} from "../../template-result/element/template-normal-element-result/i-template-normal-element-result";
import {ITemplateConstructOptions} from "../../template-construct-options/i-template-construct-options";

export interface ITemplateNormalElement extends ITemplateElement {
	construct (options: ITemplateConstructOptions): ITemplateNormalElementResult;
}