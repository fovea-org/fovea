import {IDOMConnectionObserverResult} from "./i-dom-connection-observer-result";
import {DOMMutationObserver, IDOMConnectionMutationObserver} from "./i-dom-mutation-observer";
import {DOMMutationObserverKind} from "./dom-mutation-observer-kind";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";
import {DOMConnectionCallback} from "./dom-connection-callback";
import {DOMCallbackCondition} from "./dom-callback-condition";

/*# IF hasTemplateCustomAttributes || hasMutationObservers */

// The options to provide when observing nodes
const OBSERVER_OPTIONS: MutationObserverInit = {childList: true, subtree: true};

/**
 * Checks if the given observer is connected
 * @param {IDOMConnectionMutationObserver} observer
 * @returns {boolean}
 */
function testIsConnected (observer: IDOMConnectionMutationObserver): boolean {
	return observer.node.isConnected || observer.root.contains(observer.node);
}

/**
 * Checks if the given observer is disconnected
 * @param {IDOMConnectionMutationObserver} observer
 * @returns {boolean}
 */
function testIsDisconnected (observer: IDOMConnectionMutationObserver): boolean {
	return !observer.node.isConnected && !observer.root.contains(observer.node);
}

/**
 * Invoke this function when MutationRecords are available
 * @param {MutationRecord[]} changes
 * @param {DOMMutationObserver} observer
 * @param {DOMCallbackCondition} [callbackCondition]
 */
function onChanges (changes: MutationRecord[], observer: DOMMutationObserver, callbackCondition: DOMCallbackCondition = () => true): void {
	changes.forEach(change => {

		switch (observer.kind) {
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

			case DOMMutationObserverKind.CONNECTED:
				if (testIsConnected(observer)) {
					// Test the condition
					if (!callbackCondition()) return;
					observer.callback();
				}
				break;

			case DOMMutationObserverKind.DISCONNECTED:
				if (testIsDisconnected(observer)) {
					// Test the condition
					if (!callbackCondition()) return;
					observer.callback();
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
	const mutationObserver = new MutationObserver(changes => onChanges(changes, observer, callbackCondition));
	mutationObserver.observe(observer.root, OBSERVER_OPTIONS);

	// Return an object with an 'unobserve' property which clears the observer
	return {
		unobserve: () => mutationObserver.disconnect()
	};
}

/**
 * Subscribes the given callback to the event that a Node is connected to the DOM
 * @param {Node} node
 * @param {DOMConnectionCallback} callback
 * @param {boolean} [nextTime=true]
 * @returns {IDOMConnectionObserverResult}
 */
export function onConnected (node: Node, callback: DOMConnectionCallback, nextTime: boolean = true): IDOMConnectionObserverResult {
	// Prepare the observer
	const observer: IDOMConnectionMutationObserver = {
		kind: DOMMutationObserverKind.CONNECTED,
		callback: () => {
			isConnected = true;
			callback();
		},
		root: getRootForNode(node),
		node
	};

	// Check if the node is connected
	let isConnected = nextTime ? false : testIsConnected(observer);
	// Invoke the callback immediately if the node is already connected
	if (isConnected) callback();

	// Listen for mutations
	return onMutation(observer, () => !isConnected);
}

/**
 * Subscribes the given callback to the event that a Node is disconnected from the DOM
 * @param {Node} node
 * @param {DOMConnectionCallback} callback
 * @param {boolean} [nextTime=true]
 * @returns {IDOMConnectionObserverResult}
 */
export function onDisconnected (node: Node, callback: DOMConnectionCallback, nextTime: boolean = true): IDOMConnectionObserverResult {
	// Prepare the observer
	const observer: IDOMConnectionMutationObserver = {
		kind: DOMMutationObserverKind.DISCONNECTED,
		callback: () => {
			isDisconnected = true;
			callback();
		},
		root: getRootForNode(node),
		node
	};

	// Check if the node is connected
	let isDisconnected = nextTime ? false : testIsDisconnected(observer);
	// Invoke the callback immediately if the node is already disconnected
	if (isDisconnected) callback();

	// Listen for mutations
	return onMutation(observer, () => !isDisconnected);
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

/*# END IF hasTemplateCustomAttributes || hasMutationObservers */