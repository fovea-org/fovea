import {customAttributes} from "./custom-attributes";
import {ICustomAttribute, Json} from "@fovea/common";
import {onConnected, onDisconnected} from "../dom-mutation/dom-mutation-observer/dom-mutation-observer";

/*# IF hasTemplateCustomAttributes */

/**
 * Constructs a new ICustomAttribute
 * @param {Element} hostElement
 * @param {string} name
 * @returns {object}
 */
export function constructCustomAttribute (hostElement: Element, name: string): { customAttribute: ICustomAttribute; dispose (): void } {
	// Get the constructor for it
	const constructor = customAttributes.get(name);

	// if it isn't defined, throw an exception
	if (constructor == null) {
		throw new ReferenceError(`Error: An element: '${hostElement.tagName.toLowerCase()}' had the Custom Attribute: "${name}", but it couldn't be found. Make sure to import it!`);
	}

	// Otherwise, invoke the constructor and pass the element as a reference to it
	const customAttribute = new (<Json>constructor)(hostElement);
	// Also set the hostElement as an internal property
	customAttribute.___hostElement = hostElement;

	// Subscribe to the event that the host element is attached to the DOM and invoke the 'connectedCallback' if it provided
	const connectionObserver = onConnected(hostElement, () => {
		if (customAttribute.connectedCallback != null) {
			customAttribute.connectedCallback();
		}
	});

	// Subscribe to the event that the host element is detached from the DOM and invoke the 'disconnectedCallback' if it provided
	const disconnectionObserver = onDisconnected(hostElement, () => {
		if (customAttribute.disconnectedCallback != null) {
			customAttribute.disconnectedCallback();
		}
	});
	return {
		customAttribute, dispose: () => {
			connectionObserver.unobserve();
			disconnectionObserver.unobserve();
			(<Json>connectionObserver) = null;
			(<Json>disconnectionObserver) = null;
		}
	};
} /*# END IF hasTemplateCustomAttributes */