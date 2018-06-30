import {IDOMSVGElementHandlerResult} from "./i-dom-svg-element-handler-result";
import {IDOMSVGElementHandlerOptions} from "./i-dom-svg-element-handler-options";
import {IDOMElementHandler} from "../dom-element-handler/i-dom-element-handler";

export interface IDOMSVGElementHandler extends IDOMElementHandler {
	handle (options: IDOMSVGElementHandlerOptions): IDOMSVGElementHandlerResult;
}