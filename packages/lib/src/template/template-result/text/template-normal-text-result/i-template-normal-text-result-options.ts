import {ITemplateResultOptions} from "../../template-result/i-template-result-options";

export interface ITemplateNormalTextResultOptions extends ITemplateResultOptions {
	text: string;
	owner: Node;
	root: ShadowRoot|Element;
}