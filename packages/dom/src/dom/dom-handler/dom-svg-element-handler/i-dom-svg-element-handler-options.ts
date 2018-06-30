import {IDOMHandlerOptions} from "../dom-handler/i-dom-handler-options";
import {IFoveaDOMAstSvgElement} from "../../fovea-dom-ast/i-fovea-dom-ast";

export interface IDOMSVGElementHandlerOptions extends IDOMHandlerOptions {
	node: IFoveaDOMAstSvgElement;
}