// tslint:disable:no-any

export const originalInsertBefore = Node.prototype.insertBefore;
export const originalAppendChild = Node.prototype.appendChild;
export const originalRemoveChild = Node.prototype.removeChild;
export const originalReplaceChild = Node.prototype.replaceChild;
export const originalPrepend = (<any>Element).prototype.prepend;
export const originalAppend = (<any>Element).prototype.append;
export const originalBefore = (<any>Element).prototype.before;
export const originalAfter = (<any>Element).prototype.after;
export const originalReplaceWith = (<any>Element).prototype.replaceWith;
export const originalRemove = Element.prototype.remove;
export const originalInsertAdjacentHtml = Element.prototype.insertAdjacentHTML;
export const originalElementInsertAdjacentElement = Element.prototype.insertAdjacentElement;
export const originalHTMLElementInsertAdjacentElement = HTMLElement.prototype.insertAdjacentElement;
export const originalSVGElementInsertAdjacentElement = SVGElement.prototype.insertAdjacentElement;
export const originalElementInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
export const originalHTMLElementInnerHTML = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML");
export const originalSVGElementInnerHTML = Object.getOwnPropertyDescriptor(SVGElement.prototype, "innerHTML");