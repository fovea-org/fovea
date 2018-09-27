import {FoveaHost, FoveaHostConstructor} from "@fovea/common";
import {BOUND_VISIBILITY_OBSERVERS} from "../../visibility/bound-visibility-observers";
import {VISIBILITY_OBSERVERS_FOR_HOST} from "../../visibility/host-visibility-observers-for-host/visibility-observers-for-host";
import {onInvisible, onVisible} from "../../visibility/visibility-observer";
import {parseTarget} from "../../target/parse-target";
import {takeRelevantHost} from "../../host/take-relevant-host/take-relevant-host";
import {IVisibilityObserver} from "../../visibility/i-visibility-observer";
import {IVisibilityObserverResult} from "../../visibility/i-visibility-observer-result";

// tslint:disable:no-any

/**
 * Connects a new Visibility Observer
 * @param {FoveaHost} host
 * @param {IVisibilityObserver} observer
 * @returns {IVisibilityObserverResult}
 */
function connectVisibilityObserver (host: FoveaHost, {method, visible, target}: IVisibilityObserver): IVisibilityObserverResult {
	const relevantHost = takeRelevantHost(host, method.isStatic);
	const bound = (<any>relevantHost)[method.name].bind(relevantHost);
	const targetElement = target != null ? <Element> parseTarget(host, target) : host.___hostElement;
	return visible ? onVisible(targetElement, bound) : onInvisible(targetElement, bound);
}

/**
 * Connects all visibility observers for the given host
 * @param {FoveaHost} host
 */
export function ___connectVisibilityObservers (host: FoveaHost): void {

	const constructor = <FoveaHostConstructor> host.constructor;
	const boundConnectVisibilityObserver: () => IVisibilityObserverResult = connectVisibilityObserver.bind(null, host);

	// Add visibility observers for all of the visibility observers
	BOUND_VISIBILITY_OBSERVERS.add(host, ...VISIBILITY_OBSERVERS_FOR_HOST.mapValue(constructor, boundConnectVisibilityObserver));
}