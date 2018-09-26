import {FoveaHostConstructor} from "@fovea/common";
import {IAttributeChangeObserver} from "./i-attribute-change-observer";
import {ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST} from "./attribute-change-observers-for-host";

/**
 * Maps the given attribute change observer(s) to the host, indicating that their contained methods should be invoked when any of the contained attributes change
 * @param {FoveaHostConstructor} host
 * @param {Partial<IAttributeChangeObserver>[]|Partial<IAttributeChangeObserver>} attributeChangeObserver
 */
export function addAttributeChangeObserversForHost (host: FoveaHostConstructor, attributeChangeObserver: Partial<IAttributeChangeObserver>[]|Partial<IAttributeChangeObserver>): void {
	// Add the attribute change observer(s) to the array of attribute change observers for the host
	ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST.add(host, ...(Array.isArray(attributeChangeObserver) ? attributeChangeObserver : [attributeChangeObserver]));
}