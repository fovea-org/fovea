import {IDOMConnectionObserverResult} from "./i-dom-connection-observer-result";
import {DOMMutationObserver} from "./i-dom-mutation-observer";
import {DOMMutationObserverKind} from "./dom-mutation-observer-kind";
import {DOMConnectionCallback} from "./dom-connection-callback";
import {DOMCallbackCondition} from "./dom-callback-condition";
import {IDOMConnectionObserverOptions} from "./i-dom-connection-observer-options";
import {DOMAttributeCallback} from "./dom-attribute-callback";
import {HAS_PATCHED_PROTOTYPES, patch} from "./patch/patch";
import {ConnectionEventKind} from "../connection-event-kind";
import {isConnected} from "../is-connected";

// The options to provide when observing nodes
const MUTATION_OBSERVER_OPTIONS: MutationObserverInit = {childList: true, subtree: true};

// The options to provide when observing nodes for changes to their attributes
const ATTRIBUTE_OBSERVER_OPTIONS: MutationObserverInit = {attributes: true, attributeOldValue: true};

/**
 * Invoke this function when MutationRecords are available
 * @param {MutationRecord[]} changes
 * @param {DOMMutationObserver} observer
 * @param {DOMCallbackCondition} [callbackCondition]
 */
function onMutationChanges (changes: MutationRecord[], observer: DOMMutationObserver, callbackCondition: DOMCallbackCondition = () => true): void {
	changes.forEach(change => {

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
	});
}

/**
 * Binds a new MutationObserver and invokes 'onChanges' based on the given arguments
 * @param {DOMMutationObserver} observer
 * @param {DOMCallbackCondition} [callbackCondition]
 * @returns {IDOMConnectionObserverResult}
 */
function onMutation (observer: DOMMutationObserver, callbackCondition?: DOMCallbackCondition): IDOMConnectionObserverResult {
	const mutationObserver = new MutationObserver(changes => onMutationChanges(changes, observer, callbackCondition));
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

const previousConnectionStateMap: WeakMap<Function, boolean> = new WeakMap();

/**
 * Subscribes the given callback to the event that a Node is connected to the DOM
 * @param {Node} node
 * @param {DOMConnectionCallback} callback
 * @param {Partial<IDOMConnectionObserverOptions>} options
 * @returns {IDOMConnectionObserverResult}
 */
export function onConnected (node: Node, callback: DOMConnectionCallback, {nextTime = true}: Partial<IDOMConnectionObserverOptions>): IDOMConnectionObserverResult {
	if (!HAS_PATCHED_PROTOTYPES()) patch();

	let hasReceivedEvent: boolean = false;

	const handler = (): boolean => {
		if (isConnected(node) && !hasReceivedEvent && previousConnectionStateMap.get(callback) !== true) {
			previousConnectionStateMap.set(callback, true);
			callback();
			return true;
		}
		return false;
	};

	if (!nextTime) {
		if (!handler()) {
			// Wait a tick and check again.
			setTimeout(() => handler());
		}
	}

	const eventHandler = () => {
		hasReceivedEvent = true;
		if (previousConnectionStateMap.get(callback) !== true) {
			previousConnectionStateMap.set(callback, true);
			callback();
		}
	};

	node.addEventListener(ConnectionEventKind.CONNECTED, eventHandler);

	return {
		unobserve: () => {
			node.removeEventListener(ConnectionEventKind.CONNECTED, eventHandler);
			previousConnectionStateMap.delete(callback);
		}
	};
}

/**
 * Subscribes the given callback to the event that a Node is disconnected from the DOM
 * @param {Node} node
 * @param {DOMConnectionCallback} callback
 * @param {Partial<IDOMConnectionObserverOptions>} options
 * @returns {IDOMConnectionObserverResult}
 */
export function onDisconnected (node: Node, callback: DOMConnectionCallback, {nextTime = true}: Partial<IDOMConnectionObserverOptions>): IDOMConnectionObserverResult {
	if (!HAS_PATCHED_PROTOTYPES()) patch();

	let hasReceivedEvent: boolean = false;

	const handler = (): boolean => {
		if (!isConnected(node) && !hasReceivedEvent && previousConnectionStateMap.get(callback) !== false) {
			previousConnectionStateMap.set(callback, false);
			callback();
			return true;
		}
		return false;
	};

	if (!nextTime) {
		if (!handler()) {
			// Wait a tick and check again.
			setTimeout(() => handler());
		}
	}

	const eventHandler = () => {
		hasReceivedEvent = true;
		if (previousConnectionStateMap.get(callback) !== false) {
			previousConnectionStateMap.set(callback, false);
			callback();
		}
	};

	node.addEventListener(ConnectionEventKind.DISCONNECTED, eventHandler);

	return {
		unobserve: () => {
			node.removeEventListener(ConnectionEventKind.DISCONNECTED, eventHandler);
			previousConnectionStateMap.delete(callback);
		}
	};
}