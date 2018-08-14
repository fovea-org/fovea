import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor, Json} from "@fovea/common";
import {BOUND_VISIBILITY_OBSERVERS} from "./bound-visibility-observers";
import {VISIBILITY_OBSERVERS_FOR_HOST} from "./host-visibility-observers-for-host/visibility-observers-for-host";
import {onInvisible, onVisible} from "./visibility-observer";
import {getHostElementForHost} from "../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {takeRelevantHost} from "../host/take-relevant-host/take-relevant-host";
import {parseTarget} from "../target/parse-target";

/**
 * Binds all visibility observers for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function bindVisibilityObservers (host: IFoveaHost|ICustomAttribute): void {

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;

	// Add visibility observers for all of the visibility observers
	BOUND_VISIBILITY_OBSERVERS.add(host, ...VISIBILITY_OBSERVERS_FOR_HOST.mapValue(constructor, ({method, visible, target}) => {
			const relevantHost = takeRelevantHost(host, method!.isStatic);
			const bound = (<Json>relevantHost)[method!.name].bind(relevantHost);
			const targetElement = target != null ? <Element> parseTarget(host, target) : getHostElementForHost(host);
			return visible! ? onVisible(targetElement, bound) : onInvisible(targetElement, bound);
		}
	));
}