import {IFoveaHost} from "@fovea/common";
import {IDisposable} from "../../../disposable/i-disposable";

export interface ITemplateResult extends IDisposable {
	previousSibling: ITemplateResult|null;
	lastNode: Node|null;
	owner: Node;
	upgrade (host: IFoveaHost, node: Node, root: ShadowRoot|Element): void;
}