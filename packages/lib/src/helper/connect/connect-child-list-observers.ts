import {FoveaHost, FoveaHostConstructor} from "@fovea/common";
import {takeRelevantHost} from "../../host/take-relevant-host/take-relevant-host";
import {parseTarget} from "../../target/parse-target";
import {BOUND_CHILD_LIST_OBSERVERS} from "../../dom-mutation/child-list-observers-for-host/bound-child-list-observers";
import {CHILD_LIST_OBSERVERS_FOR_HOST} from "../../dom-mutation/child-list-observers-for-host/child-list-observers-for-host";
import {onChildrenAdded, onChildrenRemoved} from "../../dom-mutation/dom-mutation-observer/dom-mutation-observer";
import {IChildListObserver} from "../../dom-mutation/child-list-observers-for-host/i-child-list-observer";
import {IChildListObserverResult} from "../../dom-mutation/child-list-observers-for-host/i-child-list-observer-result";

// tslint:disable:no-any

/**
 * Connects a child list observer to a host
 * @param {FoveaHost} host
 * @param {IChildListObserver} observer
 * @returns {IChildListObserverResult}
 */
function connectChildListObserver (host: FoveaHost, {method, added, target}: IChildListObserver): IChildListObserverResult {
	const relevantHost = takeRelevantHost(host, method!.isStatic);
	const bound = (<any>relevantHost)[method!.name].bind(relevantHost);
	const targetNode = target != null ? <Element> parseTarget(host, target) : host.___hostElement;
	return added! ? onChildrenAdded(targetNode, bound) : onChildrenRemoved(targetNode, bound);
}

/**
 * Connects all child list observers for the given host
 * @param {FoveaHost} host
 */
export function ___connectChildListObservers (host: FoveaHost): void {

	const constructor = <FoveaHostConstructor> host.constructor;
	const boundConnectChildListObserver: () => IChildListObserverResult = connectChildListObserver.bind(null, host);

	// Add child list observers for all of the mutation observers
	BOUND_CHILD_LIST_OBSERVERS.add(host, ...CHILD_LIST_OBSERVERS_FOR_HOST.mapValue(constructor, boundConnectChildListObserver));
}