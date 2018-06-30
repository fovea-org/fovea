import {ITemplateVariables} from "../template-variables/i-template-variables";
import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {TemplateElement} from "../element/template-element/template-element";
import {ITemplateResult} from "../template-result/template-result/i-template-result";

export interface ITemplateConstructOptions {
	host: IFoveaHost|ICustomAttribute;
	owner: Node;
	root: ShadowRoot|Element;
	templateVariables?: ITemplateVariables;
	base?: TemplateElement;
	previousSibling: ITemplateResult|null;
}