import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {ITemplateResult} from "./i-template-result";

export interface ITemplateResultOptions {
	previousSibling: ITemplateResult|null;
	owner: Node;
	host: IFoveaHost|ICustomAttribute;
}