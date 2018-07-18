import {DOMMutationObserverKind} from "./dom-mutation-observer-kind";
import {DOMChildCallback} from "./dom-child-callback";
import {DOMAttributeCallback} from "./dom-attribute-callback";

export interface IDOMMutationObserver {
	kind: DOMMutationObserverKind;
	root: Node|ShadowRoot;
	node: Node;
}

export interface IDOMChildMutationObserver extends IDOMMutationObserver {
	kind: DOMMutationObserverKind.CHILDREN_ADDED|DOMMutationObserverKind.CHILDREN_REMOVED;
	callback: DOMChildCallback;
}

export interface IDOMAttributeMutationObserver extends IDOMMutationObserver {
	kind: DOMMutationObserverKind.ATTRIBUTE_CHANGED;
	callback: DOMAttributeCallback;
}

export declare type DOMMutationObserver = IDOMChildMutationObserver|IDOMAttributeMutationObserver;