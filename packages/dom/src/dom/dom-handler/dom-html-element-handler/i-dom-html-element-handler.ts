import {IDOMHTMLElementHandlerOptions} from "./i-dom-html-element-handler-options";
import {IDOMHTMLElementHandlerResult} from "./i-dom-html-element-handler-result";
import {IDOMElementHandler} from "../dom-element-handler/i-dom-element-handler";

export interface IDOMHTMLElementHandler extends IDOMElementHandler {
	handle (options: IDOMHTMLElementHandlerOptions): IDOMHTMLElementHandlerResult;
}