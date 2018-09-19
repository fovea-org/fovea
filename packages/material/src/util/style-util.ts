/**
 * Applies the given styles to the given element
 * @param {HTMLElement} element
 * @param {Partial<CSSStyleDeclaration>} styles
 */
export function applyStylesToElement (element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
	Object.assign(element.style, styles);
}

/**
 * Gets the property value of the given CSS property
 * @param {HTMLElement} element
 * @param {string} property
 * @param {CSSStyleDeclaration} computedStyle
 * @returns {string}
 */
export function getCSSPropertyValue (element: HTMLElement, property: string, computedStyle: CSSStyleDeclaration = getComputedStyle(element)): string {
	return computedStyle.getPropertyValue(property);
}