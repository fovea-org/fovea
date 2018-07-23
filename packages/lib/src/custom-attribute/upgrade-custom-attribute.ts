import {ICustomAttribute} from "@fovea/common";
import {onConnected, onDisconnected} from "../dom-mutation/dom-mutation-observer/dom-mutation-observer";
import {IDOMConnectionObserverResult} from "../dom-mutation/dom-mutation-observer/i-dom-connection-observer-result";
import {IDestroyable} from "../destroyable/i-destroyable";

/*# IF hasTemplateCustomAttributes */

/**
 * Upgrades an ICustomAttribute
 * @param {ICustomAttribute} customAttribute
 * @param {Element} hostElement
 * @returns {IDestroyable}
 */
export function upgradeCustomAttribute (customAttribute: ICustomAttribute, hostElement: Element): IDestroyable {
	// Also set the hostElement as an internal property
	customAttribute.___hostElement = hostElement;

	// Subscribe to the event that the host element is attached to the DOM and invoke the 'connectedCallback' if it provided
	let connectionObserver: IDOMConnectionObserverResult|null = onConnected(hostElement, () => {
		if (customAttribute.connectedCallback != null) {
			customAttribute.connectedCallback();
		}
	}, {nextTime: false});

	// Subscribe to the event that the host element is detached from the DOM and invoke the 'disconnectedCallback' if it provided
	let disconnectionObserver: IDOMConnectionObserverResult|null = onDisconnected(hostElement, () => {
		if (customAttribute.disconnectedCallback != null) {
			customAttribute.disconnectedCallback();
		}
	}, {nextTime: true});

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
		}
	};
} /*# END IF hasTemplateCustomAttributes */