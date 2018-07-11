import {IDOMHTMLElementHandler} from "./i-dom-html-element-handler";
import {DOMElementHandler} from "../dom-element-handler/dom-element-handler";
import {IDOMHandlerCreateResult} from "../dom-handler/i-dom-handler-create-result";
import {FoveaDOMAstHTMLElement} from "../../fovea-dom-ast/i-fovea-dom-ast";

/**
 * A class that handles HTMLElements.
 */
export class DOMHTMLElementHandler extends DOMElementHandler implements IDOMHTMLElementHandler {

	/**
	 * Generates an instruction to create a new HTMLElement of the given name
	 * @param {FoveaDOMAstHTMLElement} element
	 * @returns {IDOMHandlerCreateResult|undefined}
	 */
	public create (element: FoveaDOMAstHTMLElement): IDOMHandlerCreateResult|undefined {
		return this.createBase(element, {
			createConditionalElementName: "createConditionalElement",
			createElementName: "createElement",
			createMultiElementName: "createMultiElement"
		});
	}

}