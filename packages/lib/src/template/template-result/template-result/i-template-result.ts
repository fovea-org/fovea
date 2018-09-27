import {IDisposable} from "../../../disposable/i-disposable";
import {IDestroyable} from "../../../destroyable/i-destroyable";

export interface ITemplateResult extends IDisposable, IDestroyable {
	previousSibling: ITemplateResult|null;
	lastNode: Node|null;
	owner: Node;
}