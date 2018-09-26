import {ITemplateVariables} from "../template-variables/i-template-variables";
import {FoveaHost} from "@fovea/common";
import {TemplateElement} from "../element/template-element/template-element";
import {ITemplateResult} from "../template-result/template-result/i-template-result";

export interface ITemplateConstructOptions {
	host: FoveaHost;
	owner: Node;
	root: ShadowRoot|Element;
	templateVariables?: ITemplateVariables;
	base?: TemplateElement;
	previousSibling: ITemplateResult|null;
}