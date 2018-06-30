import {DOMMutationObserverKind} from "./dom-mutation-observer-kind";
import {DOMConnectionCallback} from "./dom-connection-callback";
import {DOMChildCallback} from "./dom-child-callback";

export interface IDOMMutationObserver {
	kind: DOMMutationObserverKind;
	root: Node|ShadowRoot;
	node: Node;
}

export interface IDOMConnectionMutationObserver extends IDOMMutationObserver {
	kind: DOMMutationObserverKind.CONNECTED|DOMMutationObserverKind.DISCONNECTED;
	callback: DOMConnectionCallback;
}

export interface IDOMChildMutationObserver extends IDOMMutationObserver {
	kind: DOMMutationObserverKind.CHILDREN_ADDED|DOMMutationObserverKind.CHILDREN_REMOVED;
	callback: DOMChildCallback;
}

export declare type DOMMutationObserver = IDOMConnectionMutationObserver|IDOMChildMutationObserver;