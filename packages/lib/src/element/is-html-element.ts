/**
 * Returns true if the given node is an HTMLElement
 * @param {Node} node
 * @returns {boolean}
 */
export function isHTMLElement (node: Node): node is HTMLElement {
	return "style" in node;
}