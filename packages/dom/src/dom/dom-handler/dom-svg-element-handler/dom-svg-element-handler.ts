import {IDOMSVGElementHandler} from "./i-dom-svg-element-handler";
import {DOMElementHandler} from "../dom-element-handler/dom-element-handler";
import {IDOMHandlerCreateResult} from "../dom-handler/i-dom-handler-create-result";
import {IFoveaDOMAstSvgElement} from "../../fovea-dom-ast/i-fovea-dom-ast";
import {IContext} from "../../../util/context-util/i-context";

/**
 * A class that handles SVGElements.
 */
export class DOMSVGElementHandler extends DOMElementHandler implements IDOMSVGElementHandler {

	/**
	 * Generates an instruction to create a new SVGElement of the given name
	 * @param {IFoveaDOMAstSvgElement} element
	 * @param {IContext} context
	 * @returns {IDOMHandlerCreateResult?}
	 */
	public create (element: IFoveaDOMAstSvgElement, context: IContext): IDOMHandlerCreateResult|undefined {
		return this.createBase(element, {
			createConditionalElementName: "createConditionalElementNS",
			createElementName: "createElementNS",
			createMultiElementName: "createMultiElementNS"
		}, context);
	}

}