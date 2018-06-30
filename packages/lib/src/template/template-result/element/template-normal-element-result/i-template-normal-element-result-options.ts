import {ITemplateResultOptions} from "../../template-result/i-template-result-options";
import {ITemplateProperty} from "../../../template-property/i-template-property";
import {ITemplateListener} from "../../../template-listener/i-template-listener";
import {Ref} from "@fovea/common";
import {ITemplateVariables} from "../../../template-variables/i-template-variables";
import {TemplateNode} from "../../../node/template-node";
import {ITemplateCustomAttributeProperty} from "../../../template-property/i-template-custom-attribute-property";

export interface ITemplateNormalElementResultOptions extends ITemplateResultOptions {
	lastNode: Element;
	owner: Node;
	root: ShadowRoot|Element;
	children: TemplateNode[];
	attributes: ITemplateProperty[];
	customAttributes: ITemplateCustomAttributeProperty[];
	templateVariables?: ITemplateVariables;
	properties: ITemplateProperty[];
	listeners: ITemplateListener[];
	ref: Ref|null;
}