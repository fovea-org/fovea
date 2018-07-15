import {IDOMHTMLElementHandler} from "./i-dom-html-element-handler";
import {DOMElementHandler} from "../dom-element-handler/dom-element-handler";
import {IDOMHandlerCreateResult} from "../dom-handler/i-dom-handler-create-result";
import {FoveaDOMAstHTMLElement} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {IContext} from "../../../util/context-util/i-context";

/**
 * A class that handles HTMLElements.
 */
export class DOMHTMLElementHandler extends DOMElementHandler implements IDOMHTMLElementHandler {

	/**
	 * Generates an instruction to create a new HTMLElement of the given name
	 * @param {FoveaDOMAstHTMLElement} element
	 * @param {IContext} context
	 * @returns {IDOMHandlerCreateResult|undefined}
	 */
	public create (element: FoveaDOMAstHTMLElement, context: IContext): IDOMHandlerCreateResult|undefined {
		return this.createBase(element, {
			createConditionalElementName: "createConditionalElement",
			createElementName: "createElement",
			createMultiElementName: "createMultiElement"
		}, context);
	}

}