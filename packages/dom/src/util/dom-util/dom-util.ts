import {IDOMUtil} from "./i-dom-util";
import {IDOMElementHandlerResult} from "../../dom/dom-handler/dom-element-handler/i-dom-element-handler-result";
import {HTML_TAG_NAMES, HtmlTagName, LibHelperName, libHelperName, SVG_TAG_NAMES, SvgTagName} from "@fovea/common";
import {IContext} from "../context-util/i-context";

/**
 * A class that helps with DOM-related operations. This is most relevant within the DOM-generator and DOM-handlers.
 */
export class DOMUtil implements IDOMUtil {

	/**
	 * The name for a node that references itself
	 * @type {string}
	 */
	public readonly selfReferenceNodeName = "host";

	/**
	 * Returns an empty IDOMElementHandlerResult
	 * @returns {IDOMElementHandlerResult}
	 */
	public get emptyResult (): IDOMElementHandlerResult {
		return {
			createInstructions: [],
			addCustomAttributeInstructions: [],
			appendInstructions: [],
			addListenerInstructions: [],
			addPropertyInstructions: [],
			addRefInstructions: []
		};
	}

	/**
	 * Returns true if the provided selector is built in
	 * @param {string} selector
	 * @returns {boolean}
	 */
	public isBuiltInSelector (selector: string): boolean {
		return HTML_TAG_NAMES.has(<HtmlTagName> selector) || SVG_TAG_NAMES.has(<SvgTagName> selector);
	}

	/**
	 * Returns true if whitespace should be preserved in its' original form
	 * within the node with the given name
	 * @param {string} nodeName
	 * @returns {boolean}
	 */
	public isPreserveWhitespaceNodeName (nodeName: string): boolean {
		const lowered = nodeName.toLowerCase();
		return lowered === "pre" || lowered === "code" || lowered === "samp";
	}

	/**
	 * Returns true if formatting should be preserved inside the given node
	 * @param {string} nodeName
	 * @returns {boolean}
	 */
	public isPreserveFormattingNodeName (nodeName: string): boolean {
		const lowered = nodeName.toLowerCase();
		return lowered === "pre" || lowered === "code" || lowered === "samp";
	}

	/**
	 * Merges two object IDOMHandlerResults. One of them, the second argument, may be a partial.
	 * @param {IDOMElementHandlerResult} a
	 * @param {Partial<IDOMElementHandlerResult>} b
	 * @returns {IDOMElementHandlerResult}
	 */
	public mergeInstructions (a: IDOMElementHandlerResult, b: Partial<IDOMElementHandlerResult>): IDOMElementHandlerResult {
		return {
			createInstructions: [...a.createInstructions, ...(b.createInstructions == null ? [] : b.createInstructions)],
			addCustomAttributeInstructions: [...a.addCustomAttributeInstructions, ...(b.addCustomAttributeInstructions == null ? [] : b.addCustomAttributeInstructions)],
			appendInstructions: [...a.appendInstructions, ...(b.appendInstructions == null ? [] : b.appendInstructions)],
			addListenerInstructions: [...a.addListenerInstructions, ...(b.addListenerInstructions == null ? [] : b.addListenerInstructions)],
			addPropertyInstructions: [...a.addPropertyInstructions, ...(b.addPropertyInstructions == null ? [] : b.addPropertyInstructions)],
			addRefInstructions: [...a.addRefInstructions, ...(b.addRefInstructions == null ? [] : b.addRefInstructions)],
			rootIdentifiers: a.rootIdentifiers == null && b.rootIdentifiers == null ? undefined : [...(a.rootIdentifiers == null ? [] : a.rootIdentifiers), ...(b.rootIdentifiers == null ? [] : b.rootIdentifiers)]
		};
	}

	/**
	 * Generates an instruction to use a helper function fom FoveaLib
	 * @param {LibHelperName} helperName
	 * @param {Set<LibHelperName>} requiredHelpers
	 * @returns {string}
	 */
	public useHelper (helperName: LibHelperName, {requiredHelpers}: IContext): string {
		requiredHelpers.add(helperName);
		return libHelperName[helperName];
	}
}