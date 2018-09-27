import {IDOMConnectionObserverResult} from "./i-dom-connection-observer-result";
import {DOMMutationObserver} from "./i-dom-mutation-observer";
import {DOMMutationObserverKind} from "./dom-mutation-observer-kind";
import {DOMConnectionCallback} from "./dom-connection-callback";
import {DOMCallbackCondition} from "./dom-callback-condition";
import {DOMAttributeCallback} from "./dom-attribute-callback";
import {isConnected} from "../is-connected";

// The options to provide when observing nodes
const MUTATION_OBSERVER_OPTIONS: MutationObserverInit = {childList: true, subtree: true};

// The options to provide when observing nodes for changes to their attributes
const ATTRIBUTE_OBSERVER_OPTIONS: MutationObserverInit = {attributes: true, attributeOldValue: true};

/**
 * A Set of nodes that has been connected previously
 * @type {WeakSet<Node>}
 */
const CONNECTED_NODES: WeakSet<Node> = new WeakSet();

/**
 * The timeout for node connection checks
 * @type {number}
 */
const CONNECTED_TIMEOUT: number = 200;

/**
 * Invoked when a MutationRecord is available
 * @param {DOMMutationObserver} observer
 * @param {DOMCallbackCondition} callbackCondition
 * @param {MutationRecord} change
 */
function onMutationChange (observer: DOMMutationObserver, callbackCondition: DOMCallbackCondition, change: MutationRecord): void {
	switch (observer.kind) {

		case DOMMutationObserverKind.ATTRIBUTE_CHANGED:
			// Test the condition
			if (!callbackCondition()) return;
			observer.callback({
				attributeName: change.attributeName!,
				newValue: "getAttribute" in observer.node ? (<Element>observer.node).getAttribute(change.attributeName!) : null,
				oldValue: change.oldValue
			});
			break;

		case DOMMutationObserverKind.CHILDREN_ADDED:
			if (change.addedNodes.length > 0) {
				// Test the condition
				if (!callbackCondition()) return;
				observer.callback(Array.from(change.addedNodes));
			}
			break;

		case DOMMutationObserverKind.CHILDREN_REMOVED:
			if (change.removedNodes.length > 0) {
				// Test the condition
				if (!callbackCondition()) return;
				observer.callback(Array.from(change.removedNodes));
			}
			break;
	}
}

/**
 * Invoked when MutationRecords are available
 * @param {DOMMutationObserver} observer
 * @param {DOMCallbackCondition} callbackCondition
 * @param {MutationRecord[]} changes
 */
function onMutationChanges (observer: DOMMutationObserver, callbackCondition: DOMCallbackCondition = () => true, changes: MutationRecord[]): void {
	changes.forEach(onMutationChange.bind(null, observer, callbackCondition));
}

/**
 * Binds a new MutationObserver and invokes 'onChanges' based on the given arguments
 * @param {DOMMutationObserver} observer
 * @param {DOMCallbackCondition} [callbackCondition]
 * @returns {IDOMConnectionObserverResult}
 */
function onMutation (observer: DOMMutationObserver, callbackCondition?: DOMCallbackCondition): IDOMConnectionObserverResult {
	const mutationObserver = new MutationObserver(onMutationChanges.bind(null, observer, callbackCondition));
	mutationObserver.observe(observer.root, observer.kind === DOMMutationObserverKind.ATTRIBUTE_CHANGED ? ATTRIBUTE_OBSERVER_OPTIONS : MUTATION_OBSERVER_OPTIONS);

	// Return an object with an 'unobserve' property which clears the observer
	return {
		unobserve: () => mutationObserver.disconnect()
	};
}

/**
 * Subscribes the given callback to the event that the given node receives children
 * @param {Node} node
 * @param {DOMConnectionCallback} callback
 * @returns {IDOMConnectionObserverResult}
 */
export function onChildrenAdded (node: Node|ShadowRoot, callback: DOMConnectionCallback): IDOMConnectionObserverResult {
	return onMutation({kind: DOMMutationObserverKind.CHILDREN_ADDED, callback, root: node, node});
}

/**
 * Subscribes the given callback to the event that the given node loses children
 * @param {Node} node
 * @param {DOMConnectionCallback} callback
 * @returns {IDOMConnectionObserverResult}
 */
export function onChildrenRemoved (node: Node|ShadowRoot, callback: DOMConnectionCallback): IDOMConnectionObserverResult {
	return onMutation({kind: DOMMutationObserverKind.CHILDREN_REMOVED, callback, root: node, node});
}

/**
 * Subscribes the given callback to the event that attributes of the given node changed
 * @param {Node} node
 * @param {DOMAttributeCallback} callback
 * @returns {IDOMConnectionObserverResult}
 */
export function onAttributesChanged (node: Node|ShadowRoot, callback: DOMAttributeCallback): IDOMConnectionObserverResult {
	return onMutation({kind: DOMMutationObserverKind.ATTRIBUTE_CHANGED, callback, root: node, node});
}

/**
 * Clears the provided timeout
 * @param {Node} node
 * @param {number | undefined} timeout
 */
function unobserveConnectionObserver (node: Node, timeout: number|undefined): void {
	CONNECTED_NODES.delete(node);
	if (timeout != null) clearTimeout(timeout);
}

/**
 * Subscribes the given callback to the event that a Node is connected to the DOM
 * @param {Node} node
 * @param {DOMConnectionCallback} callback
 * @returns {IDOMConnectionObserverResult}
 */
export function onConnected (node: Node, callback: DOMConnectionCallback): IDOMConnectionObserverResult {
	let timeout: number|undefined;

	if (isConnected(node)) {
		CONNECTED_NODES.add(node);
		callback();
	}

	else {
		timeout = setTimeout(onConnected.bind(null, ...arguments), CONNECTED_TIMEOUT);
	}

	return {
		unobserve: unobserveConnectionObserver.bind(null, node, timeout)
	};
}

/**
 * Subscribes the given callback to the event that a Node is disconnected from the DOM
 * @param {Node} node
 * @param {DOMConnectionCallback} callback
 * @returns {IDOMConnectionObserverResult}
 */
export function onDisconnected (node: Node, callback: DOMConnectionCallback): IDOMConnectionObserverResult {
	let timeout: number|undefined;

	if (!isConnected(node) && CONNECTED_NODES.has(node)) {
		CONNECTED_NODES.delete(node);
		callback();
	}

	else {
		timeout = setTimeout(onDisconnected.bind(null, ...arguments), CONNECTED_TIMEOUT);
	}

	return {
		unobserve: unobserveConnectionObserver.bind(null, node, timeout)
	};
}