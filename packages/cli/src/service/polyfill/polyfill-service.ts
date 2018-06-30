import {IPolyfillService} from "./i-polyfill-service";

/**
 * A class that helps with working with Polyfills
 */
export class PolyfillService implements IPolyfillService {

	/**
	 * Returns true if the name of the given polyfill is compatible with Workers
	 * @param {string} polyfillName
	 * @returns {boolean}
	 */
	public isWorkerCompatible (polyfillName: string): boolean {
		return (
			polyfillName !== "event" &&
			polyfillName !== "dom.collections.iterable" &&
			polyfillName !== "web-components" &&
			polyfillName !== "dom.collections.iterator" &&
			polyfillName !== "dom.collections.for-each" &&
			polyfillName !== "animation" &&
			polyfillName !== "window" &&
			polyfillName !== "document" &&
			polyfillName !== "element" &&
			polyfillName !== "get-computed-style" &&
			polyfillName !== "node.contains" &&
			polyfillName !== "node.parentelement" &&
			polyfillName !== "queryselector" &&
			polyfillName !== "document-fragment" &&
			polyfillName !== "intersection-observer" &&
			polyfillName !== "mutation-observer" &&
			polyfillName !== "custom-elements" &&
			polyfillName !== "shadow-dom" &&
			polyfillName !== "template" &&
			polyfillName !== "class-list" &&
			polyfillName !== "dom-token-list" &&
			polyfillName !== "object-fit" &&
			polyfillName !== "event.constructor" &&
			polyfillName !== "event.focusin" &&
			polyfillName !== "event.hashchange" &&
			polyfillName !== "custom-event" &&
			polyfillName !== "event-source" &&
			polyfillName !== "pointer-event"
		);
	}

}