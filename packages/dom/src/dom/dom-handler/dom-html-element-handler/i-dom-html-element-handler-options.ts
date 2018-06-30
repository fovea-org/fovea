import {IDOMHandlerOptions} from "../dom-handler/i-dom-handler-options";
import {FoveaDOMAstHTMLElement} from "../../fovea-dom-ast/i-fovea-dom-ast";

export interface IDOMHTMLElementHandlerOptions extends IDOMHandlerOptions {
	node: FoveaDOMAstHTMLElement;
}