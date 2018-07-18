import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor, Json} from "@fovea/common";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {takeRelevantHost} from "../../host/take-relevant-host/take-relevant-host";
import {onChildrenAdded, onChildrenRemoved} from "../dom-mutation-observer/dom-mutation-observer";
import {parseTarget} from "../../target/parse-target";
import {CHILD_LIST_OBSERVERS_FOR_HOST} from "./child-list-observers-for-host";
import {BOUND_CHILD_LIST_OBSERVERS} from "./bound-child-list-observers";

/*# IF hasChildListObservers */

/**
 * Binds all child list observers for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function bindChildListObservers (host: IFoveaHost|ICustomAttribute): void {

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;

	// Add child list observers for all of the mutation observers
	BOUND_CHILD_LIST_OBSERVERS.add(host, ...CHILD_LIST_OBSERVERS_FOR_HOST.mapValue(constructor, ({method, added, target}) => {
			const relevantHost = takeRelevantHost(host, method!.isStatic);
			const bound = (<Json>relevantHost)[method!.name].bind(relevantHost);
			const targetNode = target != null ? <Element> parseTarget(host, target) : getHostElementForHost(host);
			return added! ? onChildrenAdded(targetNode, bound) : onChildrenRemoved(targetNode, bound);
		}
	));
} /*# END IF hasChildListObservers */