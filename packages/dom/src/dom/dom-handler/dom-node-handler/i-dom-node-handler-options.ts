import {IDOMHandlerOptions} from "../dom-handler/i-dom-handler-options";
import {IFoveaDOMAstTextNode} from "../../fovea-dom-ast/i-fovea-dom-ast";

export interface IDOMNodeHandlerOptions extends IDOMHandlerOptions {
	node: IFoveaDOMAstTextNode;
}