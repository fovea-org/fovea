import {FoveaHost} from "@fovea/common";
import {ITemplateResult} from "./i-template-result";

export interface ITemplateResultOptions {
	previousSibling: ITemplateResult|null;
	owner: Node;
	host: FoveaHost;
	root: Element|ShadowRoot;
}