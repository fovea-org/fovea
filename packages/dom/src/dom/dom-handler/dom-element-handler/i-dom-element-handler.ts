import {IDOMHandler} from "../dom-handler/i-dom-handler";
import {NodeUuid} from "../../node-uuid/node-uuid";
import {IDOMElementHandlerAddSelectorResult} from "./i-dom-element-handler-add-selector-result";
import {FoveaDOMAstElement, IFoveaDOMAstAttribute, IFoveaDOMAstCustomAttribute, IFoveaDOMAstListener} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {IDOMElementHandlerAddListenerResult} from "./i-dom-element-handler-add-listener-result";
import {IContext} from "../../../util/context-util/i-context";

export interface IDOMElementHandler extends IDOMHandler {
	addCustomAttribute (element: NodeUuid|FoveaDOMAstElement, {name, value}: IFoveaDOMAstCustomAttribute, context: IContext): string;
	addAttribute (element: NodeUuid|FoveaDOMAstElement, attribute: IFoveaDOMAstAttribute, context: IContext): string;
	addAttributes (element: NodeUuid|FoveaDOMAstElement, attributes: IFoveaDOMAstAttribute[], context: IContext): string;
	addProperty (element: NodeUuid|FoveaDOMAstElement, attribute: IFoveaDOMAstAttribute, context: IContext): string;
	addProperties (element: NodeUuid|FoveaDOMAstElement, properties: IFoveaDOMAstAttribute[], context: IContext): string;
	addRef (child: FoveaDOMAstElement, context: IContext): IDOMElementHandlerAddSelectorResult|null;
	addListener (element: NodeUuid|FoveaDOMAstElement, listener: IFoveaDOMAstListener, context: IContext): IDOMElementHandlerAddListenerResult;
}