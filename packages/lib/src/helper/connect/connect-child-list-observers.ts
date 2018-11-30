import {FoveaHost, FoveaHostConstructor, Json} from "@fovea/common";
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
 * @param {Json} _host
 * @param {IChildListObserver} observer
 * @returns {IChildListObserverResult}
 */
function connectChildListObserver (_host: Json, {method, added, target}: IChildListObserver): IChildListObserverResult {
	const host = _host as FoveaHost;
	const relevantHost = takeRelevantHost(host, method.isStatic);
	const bound = (relevantHost as any)[method.name].bind(relevantHost);
	const targetNode = target != null ? parseTarget(host, target) as Element : host.___hostElement;
	return added ? onChildrenAdded(targetNode, bound) : onChildrenRemoved(targetNode, bound);
}

/**
 * Connects all child list observers for the given host
 * @param {Json} _host
 */
export function ___connectChildListObservers (_host: Json): void {
	const host = _host as FoveaHost;

	const constructor = host.constructor as FoveaHostConstructor;
	const boundConnectChildListObserver: () => IChildListObserverResult = connectChildListObserver.bind(null, host);

	// Add child list observers for all of the mutation observers
	BOUND_CHILD_LIST_OBSERVERS.add(host, ...CHILD_LIST_OBSERVERS_FOR_HOST.mapValue(constructor, boundConnectChildListObserver));
}