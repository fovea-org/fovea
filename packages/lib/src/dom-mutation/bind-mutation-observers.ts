import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor, Json} from "@fovea/common";
import {BOUND_MUTATION_OBSERVERS} from "./bound-mutation-observers";
import {getHostElementForHost} from "../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {takeRelevantHost} from "../host/take-relevant-host/take-relevant-host";
import {MUTATION_OBSERVERS_FOR_HOST} from "./mutation-observers-for-host/mutation-observers-for-host";
import {onChildrenAdded, onChildrenRemoved} from "./dom-mutation-observer/dom-mutation-observer";
import {parseTarget} from "../target/parse-target";

/*# IF hasMutationObservers */

/**
 * Binds all mutation observers for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function bindMutationObservers (host: IFoveaHost|ICustomAttribute): void {

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;

	// Add mutation observers for all of the mutation observers
	BOUND_MUTATION_OBSERVERS.add(host, ...MUTATION_OBSERVERS_FOR_HOST.mapValue(constructor, ({method, added, target}) => {
			const relevantHost = takeRelevantHost(host, method!.isStatic);
			const bound = (<Json>relevantHost)[method!.name].bind(relevantHost);
			const targetNode = target != null ? <Element> parseTarget(host, target) : getHostElementForHost(host);
			return added! ? onChildrenAdded(targetNode, bound) : onChildrenRemoved(targetNode, bound);
		}
	));
} /*# END IF hasMutationObservers */