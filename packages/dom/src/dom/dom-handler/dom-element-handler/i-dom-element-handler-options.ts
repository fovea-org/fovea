import {IDOMHandlerOptions} from "../dom-handler/i-dom-handler-options";
import {FoveaDOMAstElement} from "../../fovea-dom-ast/i-fovea-dom-ast";

export interface IDOMElementHandlerOptions extends IDOMHandlerOptions {
	node: FoveaDOMAstElement;
}