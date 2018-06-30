import {IDOMHandlerResult} from "../dom-handler/i-dom-handler-result";
import {IDOMElementHandlerAddSelectorResult} from "./i-dom-element-handler-add-selector-result";
import {IDOMHandlerAddPropertyResult} from "../dom-handler/i-dom-handler-add-property-result";
import {IDOMElementHandlerAddListenerResult} from "./i-dom-element-handler-add-listener-result";

export interface IDOMElementHandlerResult extends IDOMHandlerResult {
	addRefInstructions: IDOMElementHandlerAddSelectorResult[];
	addListenerInstructions: IDOMElementHandlerAddListenerResult[];
	addPropertyInstructions: IDOMHandlerAddPropertyResult[];
	addCustomAttributeInstructions: string[];
}