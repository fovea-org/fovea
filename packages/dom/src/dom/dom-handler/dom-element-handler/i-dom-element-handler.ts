import {IDOMHandler} from "../dom-handler/i-dom-handler";
import {NodeUuid} from "../../node-uuid/node-uuid";
import {IDOMElementHandlerAddSelectorResult} from "./i-dom-element-handler-add-selector-result";
import {FoveaDOMAstElement, IFoveaDOMAstAttribute, IFoveaDOMAstCustomAttribute, IFoveaDOMAstListener} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {IDOMElementHandlerAddListenerResult} from "./i-dom-element-handler-add-listener-result";

export interface IDOMElementHandler extends IDOMHandler {
	addCustomAttribute (element: NodeUuid|FoveaDOMAstElement, {name, value}: IFoveaDOMAstCustomAttribute): string;
	addAttribute (element: NodeUuid|FoveaDOMAstElement, attribute: IFoveaDOMAstAttribute): string;
	addAttributes (element: NodeUuid|FoveaDOMAstElement, attributes: IFoveaDOMAstAttribute[]): string;
	addValue (element: NodeUuid|FoveaDOMAstElement, attribute: IFoveaDOMAstAttribute): string;
	addValues (element: NodeUuid|FoveaDOMAstElement, properties: IFoveaDOMAstAttribute[]): string;
	addRef (child: FoveaDOMAstElement): IDOMElementHandlerAddSelectorResult|null;
	addListener (element: NodeUuid|FoveaDOMAstElement, listener: IFoveaDOMAstListener): IDOMElementHandlerAddListenerResult;
}