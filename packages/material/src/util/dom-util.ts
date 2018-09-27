/**
 * Finds the first parent from the given element that matches the given selector or prototype
 * @param {string} selector
 * @param {Element} element
 * @returns {Element | undefined}
 */
export function findMatchingElementUp (selector: string|Function, element: Element): Element|undefined {
	if (typeof selector === "string") {
		const nodeNameLowerCase = element.nodeName.toLowerCase();
		const selectorLowerCase = selector.toLowerCase();
		if (nodeNameLowerCase === selectorLowerCase) return element;
	}

	else {
		if (element.constructor === selector) return element;
	}

	if (element.parentElement == null) return undefined;
	return findMatchingElementUp(selector, element.parentElement);
}