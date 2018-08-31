import {IVisibilityObserverResult} from "./i-visibility-observer-result";
import {log} from "../log/log";

// Define the observer
let intersectionObserver: IntersectionObserver|null = null;

/**
 * The Set of all observed elements
 * @type {Set<Element>}
 */
const observedElements: WeakSet<Element> = new WeakSet();

// Define a map between Elements and callbacks to invoke when the nodes become visible
const visibleCallbacks: Map<Element, Set<() => void|Promise<void>>> = new Map();

// Define a map between Elements and callbacks to invoke when the nodes become invisible
const invisibleCallbacks: Map<Element, Set<() => void|Promise<void>>> = new Map();

/**
 * Invoke this function when IntersectionObserverEntries are available
 * @param {IntersectionObserverEntry[]} changes
 */
function onChanges (changes: IntersectionObserverEntry[]): void {
	changes.forEach(({target, isIntersecting}) => {
		const callbacks = isIntersecting ? visibleCallbacks.get(target) : invisibleCallbacks.get(target);
		if (callbacks != null) {
			callbacks.forEach(callback => callback());
		}
	});
}

/**
 * Subscribes the given callback to the event that an Element becomes visible
 * @param {Element} element
 * @param {() => (void | Promise<void>)} callback
 * @returns {IVisibilityObserverResult}
 */
export function onVisible (element: Element, callback: () => void|Promise<void>): IVisibilityObserverResult {
	return observeVisibilityChanged(element, callback, "visible");
}

/**
 * Subscribes the given callback to the event that an Element becomes invisible
 * @param {Element} element
 * @param {() => (void | Promise<void>)} callback
 * @returns {IVisibilityObserverResult}
 */
export function onInvisible (element: Element, callback: () => void|Promise<void>): IVisibilityObserverResult {
	return observeVisibilityChanged(element, callback, "invisible");
}

/**
 * Will attach a visibility observer for the given element and callback
 * @param {Element} element
 * @param {() => (void | Promise<void>)} callback
 * @param {"visible" | "invisible"} visibility
 * @returns {IVisibilityObserverResult}
 */
function observeVisibilityChanged (element: Element, callback: () => void|Promise<void>, visibility: "visible"|"invisible"): IVisibilityObserverResult {
	// Add the provided callback to the observers for the node
	const observers = getObserversOfKindForElement(element, visibility);
	observers.add(callback);

	// Return an object with an 'unobserve' property which clears the observer
	return {
		unobserve: () => observers.delete(callback)
	};
}

/**
 * Gets the observers for an Element of the given kind
 * @param {Element} element
 * @param {"connected" | "disconnected"} kind
 * @returns {Set<Function>}
 */
function getObserversOfKindForElement (element: Element, kind: "visible"|"invisible"): Set<() => void|Promise<void>> {

	// Make sure to observe the Element if it isn't already being observed
	if (!observedElements.has(element)) {
		// Bind an IntersectionObserver if it isn't already bound
		if (intersectionObserver == null) {
			// Assert that IntersectionObservers are supported
			if (!("IntersectionObserver" in window)) {
				log(`The @onBecame[Visible|Invisible] decorators require support for IntersectionObservers: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API. The element was:`, element);
				return new Set();
			}
			else intersectionObserver = new IntersectionObserver(onChanges);
		}
		intersectionObserver.observe(element);
		observedElements.add(element);
	}

	let callbacks = kind === "visible" ? visibleCallbacks.get(element) : invisibleCallbacks.get(element);

	// If none were found, initialize to an empty array
	if (callbacks == null) {
		callbacks = new Set();
		kind === "visible" ? visibleCallbacks.set(element, callbacks) : invisibleCallbacks.set(element, callbacks);
	}
	return callbacks;
}