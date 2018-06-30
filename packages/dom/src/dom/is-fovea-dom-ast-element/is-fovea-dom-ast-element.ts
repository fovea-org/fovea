import {NodeUuid} from "../node-uuid/node-uuid";
import {FoveaDOMAstElement, FoveaDOMAstNode} from "../fovea-dom-ast/i-fovea-dom-ast";
import {isFoveaDOMAstHTMLElement} from "../is-fovea-dom-ast-html-element/is-fovea-dom-ast-html-element";
import {isFoveaDOMAstSvgElement} from "../is-fovea-dom-ast-svg-element/is-fovea-dom-ast-svg-element";

/**
 * Returns true if the given item is a FoveaDOMAstElement.
 * @param {null|NodeUuid|FoveaDOMAstNode} item
 * @returns {boolean}
 */
export function isFoveaDOMAstElement (item: null|NodeUuid|FoveaDOMAstNode): item is FoveaDOMAstElement {
	return isFoveaDOMAstHTMLElement(item) || isFoveaDOMAstSvgElement(item);
}