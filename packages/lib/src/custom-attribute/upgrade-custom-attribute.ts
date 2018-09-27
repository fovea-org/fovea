import {ICustomAttribute} from "@fovea/common";
import {onConnected, onDisconnected} from "../dom-mutation/dom-mutation-observer/dom-mutation-observer";
import {IDOMConnectionObserverResult} from "../dom-mutation/dom-mutation-observer/i-dom-connection-observer-result";
import {IDestroyable} from "../destroyable/i-destroyable";

/**
 * Upgrades an ICustomAttribute
 * @param {ICustomAttribute} customAttribute
 * @param {Element} hostElement
 * @returns {IDestroyable}
 */
export function upgradeCustomAttribute (customAttribute: ICustomAttribute, hostElement: Element): IDestroyable {
	// Also set the hostElement as an internal property
	customAttribute.___hostElement = hostElement;
	let hasReceivedDisconnected = false;

	// Subscribe to the event that the host element is attached to the DOM and invoke the 'connectedCallback' if it provided
	let connectionObserver: IDOMConnectionObserverResult|null = onConnected(hostElement, () => {
		if (customAttribute.connectedCallback != null) {
			customAttribute.connectedCallback();
		}
	});

	// Subscribe to the event that the host element is detached from the DOM and invoke the 'disconnectedCallback' if it provided
	let disconnectionObserver: IDOMConnectionObserverResult|null = onDisconnected(hostElement, () => {
		hasReceivedDisconnected = true;
		if (customAttribute.disconnectedCallback != null) {
			customAttribute.disconnectedCallback();
		}
	});

	return {
		destroy: () => {
			if (connectionObserver != null) {
				connectionObserver.unobserve();
				connectionObserver = null;
			}

			if (disconnectionObserver != null) {
				disconnectionObserver.unobserve();
				disconnectionObserver = null;
			}

			if (!hasReceivedDisconnected && customAttribute.disconnectedCallback != null) {
				hasReceivedDisconnected = true;
				customAttribute.disconnectedCallback();
			}
		}
	};
}