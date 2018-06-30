import {IFoveaHost} from "@fovea/common";

export interface ITemplateResult {
	previousSibling: ITemplateResult|null;
	lastNode: Node|null;
	owner: Node;
	dispose (): void;
	upgrade (host: IFoveaHost, node: Node, root: ShadowRoot|Element): void;
}