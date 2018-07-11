import {IDOMHandlerOptions} from "./i-dom-handler-options";
import {IDOMHandlerResult} from "./i-dom-handler-result";
import {NodeUuid} from "../../node-uuid/node-uuid";
import {IDOMHandlerAppendResult} from "./i-dom-handler-append-result";
import {IDOMHandlerCreateResult} from "./i-dom-handler-create-result";
import {FoveaDOMAstNode} from "../../fovea-dom-ast/i-fovea-dom-ast";

export interface IDOMHandler {
	handle (options: IDOMHandlerOptions): IDOMHandlerResult;
	create (node: FoveaDOMAstNode): IDOMHandlerCreateResult|undefined;
	append (node: FoveaDOMAstNode|NodeUuid, toNode: FoveaDOMAstNode|NodeUuid|undefined): IDOMHandlerAppendResult;
	resetUuid (): void;
}