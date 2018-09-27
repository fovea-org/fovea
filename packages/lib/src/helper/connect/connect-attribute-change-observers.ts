import {FoveaHost, FoveaHostConstructor} from "@fovea/common";
import {takeRelevantHost} from "../../host/take-relevant-host/take-relevant-host";
import {parseTarget} from "../../target/parse-target";
import {BOUND_ATTRIBUTE_CHANGE_OBSERVERS} from "../../dom-mutation/attribute-change-observers-for-host/bound-attribute-change-observers";
import {ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST} from "../../dom-mutation/attribute-change-observers-for-host/attribute-change-observers-for-host";
import {onAttributesChanged} from "../../dom-mutation/dom-mutation-observer/dom-mutation-observer";
import {IAttributeChangeObserver} from "../../dom-mutation/attribute-change-observers-for-host/i-attribute-change-observer";
import {IAttributeChangeObserverResult} from "../../dom-mutation/attribute-change-observers-for-host/i-attribute-change-observer-result";
import {IDOMAttributeMutationPayload} from "../../dom-mutation/dom-mutation-observer/i-dom-attribute-mutation-payload";

// tslint:disable:no-any

/**
 * Invoked the observer callback of a bound attribute change observer
 * @param {Function} bound
 * @param {string[]} attributes
 * @param {string} attributeName
 * @param {string | null} newValue
 * @param {string | null} oldValue
 */
function invokeBoundAttributeChangeObserverCallback (bound: Function, attributes: string[], {attributeName, newValue, oldValue}: IDOMAttributeMutationPayload): void {
	if (attributes == null || !attributes.includes(attributeName)) return;
	bound(attributeName, newValue, oldValue);
}

/**
 * Connects the given attribute change observer to the host
 * @param {FoveaHost} host
 * @param {IAttributeChangeObserver} observer
 * @returns {IAttributeChangeObserverResult}
 */
function connectAttributeChangeObserver (host: FoveaHost, {method, attributes, target}: IAttributeChangeObserver): IAttributeChangeObserverResult {
	const relevantHost = takeRelevantHost(host, method.isStatic);
	const bound = (<any>relevantHost)[method.name].bind(relevantHost);
	const targetNode = target != null ? <Element> parseTarget(host, target) : host.___hostElement;
	const boundInvokeBoundAttributeChangeObserverCallback = invokeBoundAttributeChangeObserverCallback.bind(null, bound, attributes);

	return onAttributesChanged(targetNode, boundInvokeBoundAttributeChangeObserverCallback);
}

/**
 * Connects all attribute change observers for the given host
 * @param {FoveaHost} host
 */
export function ___connectAttributeChangeObservers (host: FoveaHost): void {

	const constructor = <FoveaHostConstructor> host.constructor;
	const boundConnectAttributeChangeObserver: () => IAttributeChangeObserverResult = connectAttributeChangeObserver.bind(null, host);

	// Add child list observers for all of the mutation observers
	BOUND_ATTRIBUTE_CHANGE_OBSERVERS.add(host, ...ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST.mapValue(constructor, boundConnectAttributeChangeObserver));
}