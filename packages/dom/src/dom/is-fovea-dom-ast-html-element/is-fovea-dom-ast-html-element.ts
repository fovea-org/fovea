import {NodeUuid} from "../node-uuid/node-uuid";
import {FoveaDOMAstHTMLElement, FoveaDOMAstNode} from "../fovea-dom-ast/i-fovea-dom-ast";
import {isFoveaDOMAstCustomElement} from "../is-fovea-dom-ast-custom-element/is-fovea-dom-ast-custom-element";
import {isFoveaDOMAstNativeElement} from "../is-fovea-dom-ast-native-element/is-fovea-dom-ast-native-element";

/**
 * Returns true if the given item is a FoveaDOMAstHTMLElement.
 * @param {null|NodeUuid|FoveaDOMAstNode} item
 * @returns {boolean}
 */
export function isFoveaDOMAstHTMLElement (item: null|NodeUuid|FoveaDOMAstNode): item is FoveaDOMAstHTMLElement {
	return isFoveaDOMAstCustomElement(item) || isFoveaDOMAstNativeElement(item);
}