import {FoveaHost, FoveaHostConstructor, Json} from "@fovea/common";
import {listen} from "../../listen/listen";
import {parseTarget} from "../../target/parse-target";
import {BOUND_HOST_LISTENERS} from "../../listener/host-listener/bound-host-listeners";
import {HOST_LISTENERS_FOR_HOST} from "../../listener/host-listener/host-listeners-for-host/host-listeners-for-host";

/**
 * Connects all listeners for the given host
 * @param {Json} _host
 */
export function ___connectListeners (_host: Json): void {
	const host = _host as FoveaHost;

	const constructor = <FoveaHostConstructor> host.constructor;

	// Add listeners for all of the host listeners where the condition is truthy
	BOUND_HOST_LISTENERS.add(host, ...HOST_LISTENERS_FOR_HOST
		.filterValues(constructor, ({condition}) => condition == null ? true : condition)
		.map(({passive, method, once, eventName, on}) => listen({
				on: on != null ? <EventTarget> parseTarget(host, on) : host.___hostElement,
				rawOn: on,
				host,
				passive,
				once,
				handler: <Function> (method!.isStatic
					? constructor[<keyof FoveaHostConstructor> method!.name]
					: <Function> host[<keyof FoveaHost>method!.name]),
				name: eventName!
			})
		));
}