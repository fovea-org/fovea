import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor, Json} from "@fovea/common";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {takeRelevantHost} from "../../host/take-relevant-host/take-relevant-host";
import {onAttributesChanged} from "../dom-mutation-observer/dom-mutation-observer";
import {parseTarget} from "../../target/parse-target";
import {BOUND_ATTRIBUTE_CHANGE_OBSERVERS} from "./bound-attribute-change-observers";
import {ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST} from "./attribute-change-observers-for-host";

/**
 * Binds all attribute change observers for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function bindAttributeChangeObservers (host: IFoveaHost|ICustomAttribute): void {

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;

	// Add child list observers for all of the mutation observers
	BOUND_ATTRIBUTE_CHANGE_OBSERVERS.add(host, ...ATTRIBUTE_CHANGE_OBSERVERS_FOR_HOST.mapValue(constructor, ({method, attributes, target}) => {
			const relevantHost = takeRelevantHost(host, method!.isStatic);
			const bound = (<Json>relevantHost)[method!.name].bind(relevantHost);
			const targetNode = target != null ? <Element> parseTarget(host, target) : getHostElementForHost(host);
			return onAttributesChanged(targetNode, result => {
				if (attributes != null && attributes.includes(result.attributeName)) {
					bound(
						result.attributeName,
						result.newValue,
						result.oldValue
					);
				}
			});
		}
	));
}