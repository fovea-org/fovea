import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor} from "@fovea/common";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {listen} from "../../listen/listen";
import {parseTarget} from "../../target/parse-target";
import {BOUND_HOST_LISTENERS} from "../../listener/host-listener/bound-host-listeners";
import {HOST_LISTENERS_FOR_HOST} from "../../listener/host-listener/host-listeners-for-host/host-listeners-for-host";

/**
 * Connects all listeners for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function ___connectListeners (host: IFoveaHost|ICustomAttribute): void {

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;

	// Add listeners for all of the host listeners where the condition is truthy
	BOUND_HOST_LISTENERS.add(host, ...HOST_LISTENERS_FOR_HOST
		.filterValues(constructor, ({condition}) => condition == null ? true : condition)
		.map(({passive, method, once, eventName, on}) => listen({
				on: on != null ? <EventTarget> parseTarget(host, on) : getHostElementForHost(host),
				rawOn: on,
				host,
				passive,
				once,
				handler: <Function> (method!.isStatic
					? constructor[<keyof (IFoveaHostConstructor|ICustomAttributeConstructor)> method!.name]
					: <Function> host[<keyof (IFoveaHost|ICustomAttribute)>method!.name]),
				name: eventName!
			})
		));
}