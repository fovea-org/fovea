import {IDOMNodeHandlerOptions} from "./i-dom-node-handler-options";
import {IDOMNodeHandlerResult} from "./i-dom-node-handler-result";
import {IDOMHandler} from "../dom-handler/i-dom-handler";

export interface IDOMNodeHandler extends IDOMHandler {
	handle (options: IDOMNodeHandlerOptions): IDOMNodeHandlerResult;
}