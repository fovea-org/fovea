declare const ShadowRoot: Function;

/**
 * Returns true if the given node is connected to the document
 * @param {Node} node
 * @returns {boolean}
 */
export function isConnected (node: Node|ShadowRoot): boolean {
	let current = node;
	while (true) {
		if (current === document) return true;
		if (!(current instanceof ShadowRoot)) {
			if (current.parentNode == null) return false;
			current = current.parentNode;
		}
		else {
			current = (<ShadowRoot> current).host;
		}
	}
}