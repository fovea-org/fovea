import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {IAttributeChangeObserver} from "./i-attribute-change-observer";
import {ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST} from "./attribute-change-observers-for-host";

/*# IF hasAttributeChangeObservers */

/**
 * Maps the given attribute change observer(s) to the host, indicating that their contained methods should be invoked when any of the contained attributes change
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @param {Partial<IAttributeChangeObserver>[]|Partial<IAttributeChangeObserver>} attributeChangeObserver
 */
export function addAttributeChangeObserversForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor, attributeChangeObserver: Partial<IAttributeChangeObserver>[]|Partial<IAttributeChangeObserver>): void {
	// Add the attribute change observer(s) to the array of attribute change observers for the host
	ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST.add(host, ...(Array.isArray(attributeChangeObserver) ? attributeChangeObserver : [attributeChangeObserver]));
} /*# END IF hasAttributeChangeObservers */