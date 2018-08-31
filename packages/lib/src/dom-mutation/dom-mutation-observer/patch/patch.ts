// tslint:disable:no-any

import {ConnectionEventKind} from "../../connection-event-kind";
import {isConnected} from "../../is-connected";
import {originalAfter, originalAppend, originalAppendChild, originalBefore, originalElementInnerHTML, originalElementInsertAdjacentElement, originalHTMLElementInnerHTML, originalHTMLElementInsertAdjacentElement, originalInsertAdjacentHtml, originalInsertBefore, originalPrepend, originalRemove, originalRemoveChild, originalReplaceChild, originalReplaceWith, originalSVGElementInnerHTML, originalSVGElementInsertAdjacentElement} from "./original";

// Whether or not the patch has been applied
let hasPatched: boolean = false;
export const HAS_PATCHED_PROTOTYPES = () => hasPatched;

/**
 * Fires an event on a Node
 * @param {ConnectionEventKind} name
 * @param {Node} target
 */
function fireEvent (name: ConnectionEventKind, target: Node): void {
	target.dispatchEvent(new CustomEvent(name));
}

/**
 * Retrieves the next sibling or ancestor sibling for a Node
 * @param {Node} root
 * @param {Node} start
 * @return {Node|null}
 */
function nextSiblingOrAncestorSibling (root: Node, start: Node|null): Node|null {
	let node = start;
	while (node != null && node !== root && node.nextSibling == null) {
		node = node.parentNode;
	}
	return (node == null || node === root) ? null : node.nextSibling;
}

/**
 * Retrieves the next node from a given position
 * @param {Node} root
 * @param {Node} start
 * @return {Node|null}
 */
function nextNode (root: Node, start: Node): Node|null {
	return start.firstChild != null ? start.firstChild : nextSiblingOrAncestorSibling(root, start);
}

/**
 * Walks all deep descendant elements from a root
 * @param {Node} root
 * @param {(node: Node) => void} callback
 */
export function walkDeepDescendantElements (root: Node, callback: (node: Node) => void): void {
	let node: Node|null = root;
	while (node != null) {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const element = <Element> node;

			callback(element);

			const localName = element.localName;
			if (localName === "template") {
				// Ignore descendants of templates. There shouldn't be any descendants
				// because they will be moved into `.content` during construction in
				// browsers that support template but, in case they exist and are still
				// waiting to be moved by a polyfill, they will be ignored.
				node = nextSiblingOrAncestorSibling(root, element);
				continue;
			}

			// Walk shadow roots.
			const shadowRoot = element.shadowRoot;
			if (shadowRoot != null) {
				for (let child = shadowRoot.firstChild; child != null; child = child.nextSibling) {
					walkDeepDescendantElements(child, callback);
				}
			}
		}

		node = nextNode(root, node);
	}
}

/**
 * Handles a DOM Mutation
 * @param {Node} node
 * @param {boolean} wasConnected
 * @param {Node | null} oldParent
 */
function handleDOMMutation (node: Node, wasConnected: boolean, oldParent: Node|null): void {
	if (node.parentNode !== oldParent) {
		// Fire the DISCONNECTED event if the node was previously connected
		if (wasConnected) {
			walkDeepDescendantElements(node, currentNode => fireEvent(ConnectionEventKind.DISCONNECTED, currentNode));
		}

		// Fire the CONNECTED event if the parent changed
		if (isConnected(node)) {
			walkDeepDescendantElements(node, currentNode => fireEvent(ConnectionEventKind.CONNECTED, currentNode));
		}
	}
}

/**
 * Performs some work
 * @param {T[]T} nodes
 * @param {U} operation
 * @returns {U extends undefined ? undefined : T}
 */
function work<T extends Node, U extends Function|undefined> (nodes: T[]|T, operation: U): U extends undefined ? undefined : T {
	const normalizedNodes: T[] = Array.isArray(nodes) ? nodes : [nodes];
	const oldParents = normalizedNodes.map(node => node.parentNode);
	const wasConnecteds = normalizedNodes.map(node => isConnected(node));
	const rawResult = operation == null ? undefined : operation();

	for (let i = 0; i < normalizedNodes.length; i++) {
		setTimeout(() => {
			handleDOMMutation(normalizedNodes[i], wasConnecteds[i], oldParents[i]);
		}, 0);
	}

	return rawResult;
}

/**
 * Patches Nodes, Elements, HTMLElements and SVGElements to fire events when they are connected and disconnected
 */
export function patch (): void {
	if (hasPatched) return;
	hasPatched = true;

	Node.prototype.insertBefore = function <T extends Node> (node: T, refChild: Node|null): T {
		return work(node, <Function> originalInsertBefore.bind(this, node, refChild));
	};

	Node.prototype.appendChild = function <T extends Node> (newChild: T): T {
		return work(newChild, <Function> originalAppendChild.bind(this, newChild));
	};

	Node.prototype.removeChild = function <T extends Node> (oldChild: T): T {
		return work(oldChild, <Function> originalRemoveChild.bind(this, oldChild));
	};

	Element.prototype.remove = function (): void {
		work(this, <Function> originalRemove.bind(this));
	};

	(<any>Element).prototype.prepend = function (...nodes: Node[]): void {
		work(nodes, <Function> originalPrepend.bind(this, ...nodes));
	};

	(<any>Element).prototype.append = function (...nodes: Node[]): void {
		work(nodes, <Function> originalAppend.bind(this, ...nodes));
	};

	(<any>Element).prototype.before = function (...nodes: Node[]): void {
		work(nodes, <Function> originalBefore.bind(this, ...nodes));
	};

	(<any>Element).prototype.after = function (...nodes: Node[]): void {
		work(nodes, <Function> originalAfter.bind(this, ...nodes));
	};

	(<any>Element).prototype.replaceWith = function (...nodes: Node[]): void {
		work([this, ...nodes], <Function> originalReplaceWith.bind(this, ...nodes));
	};

	Node.prototype.replaceChild = function <T extends Node> (newChild: Node, oldChild: T): T {
		return <T> work([newChild, oldChild], <Function> originalReplaceChild.bind(this, newChild, oldChild));
	};

	Element.prototype.insertAdjacentHTML = function (where: InsertPosition, html: string): void {
		const wasConnected = isConnected(this);
		originalInsertAdjacentHtml.call(this, where, html);

		if (wasConnected) {
			fireConnectedEvent.call(this);
		}
	};

	Element.prototype.insertAdjacentElement = function (position: InsertPosition, insertedElement: Element): Element|null {
		return work(insertedElement, <Function> originalElementInsertAdjacentElement.bind(this, position, insertedElement));
	};

	HTMLElement.prototype.insertAdjacentElement = function (position: InsertPosition, insertedElement: Element): Element|null {
		return work(insertedElement, <Function> originalHTMLElementInsertAdjacentElement.bind(this, position, insertedElement));
	};

	SVGElement.prototype.insertAdjacentElement = function (position: InsertPosition, insertedElement: Element): Element|null {
		return work(insertedElement, <Function> originalSVGElementInsertAdjacentElement.bind(this, position, insertedElement));
	};

	/**
	 * Fires a 'CONNECTED' event. Must be bound to a value for 'this'
	 */
	function fireConnectedEvent (this: Node): void {
		setTimeout(() => {
			walkDeepDescendantElements(this, currentNode => {
				if (currentNode === this) return;
				fireEvent(ConnectionEventKind.CONNECTED, currentNode);
			});
		}, 0);
	}

	/**
	 * Patches innerHTML for the given Node
	 * @param {Node} destination
	 * @param {PropertyDescriptor} baseDescriptor
	 */
	function patchInnerHTML (destination: Node, baseDescriptor: PropertyDescriptor) {
		Object.defineProperty(destination, "innerHTML", {
			enumerable: baseDescriptor.enumerable,
			configurable: true,
			get: baseDescriptor.get,
			set: function (htmlString: string): string {
				const wasConnected = isConnected(<Node>this);

				// Fire DISCONNECTED events on all current children of the node
				if (wasConnected) {
					walkDeepDescendantElements(this, currentNode => {
						if (currentNode === this) return;
						fireEvent(ConnectionEventKind.DISCONNECTED, currentNode);
					});
				}

				baseDescriptor.set!.call(this, htmlString);

				// Now, Fire CONNECTED events on all current children of the node
				if (wasConnected) {
					fireConnectedEvent.call(this);
				}
				return htmlString;
			}
		});
	}

	if (originalElementInnerHTML != null) {
		patchInnerHTML(Element.prototype, originalElementInnerHTML);
	}

	if (originalHTMLElementInnerHTML != null) {
		patchInnerHTML(HTMLElement.prototype, originalHTMLElementInnerHTML);
	}

	if (originalSVGElementInnerHTML != null) {
		patchInnerHTML(SVGElement.prototype, originalSVGElementInnerHTML);
	}
}