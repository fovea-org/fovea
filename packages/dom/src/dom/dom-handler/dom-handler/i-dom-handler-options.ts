import {FoveaDOMAstNode} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {IContext} from "../../../util/context-util/i-context";

export interface IDOMHandlerOptions {
	node: FoveaDOMAstNode;
	context: IContext;
}