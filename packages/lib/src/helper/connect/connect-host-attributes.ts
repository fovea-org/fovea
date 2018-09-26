import {FoveaHost, FoveaHostConstructor} from "@fovea/common";
import {BOUND_HOST_ATTRIBUTES_FOR_HOST} from "../../host-attributes/bound-host-attributes-for-host/bound-host-attributes-for-host";
import {HOST_ATTRIBUTES_FOR_HOST} from "../../host-attributes/host-attributes-for-host/host-attributes-for-host";
import {HostAttributesCallback} from "../../host-attributes/host-attributes-callback/host-attributes-callback";
import {hostAttributesHelperMap} from "../../host-attributes/host-attributes-helper-map/host-attributes-helper-map";

/**
 * Connects all host attributes for the given host
 * @param {FoveaHost} host
 */
export function ___connectHostAttributes (host: FoveaHost): void {

	const constructor = <FoveaHostConstructor> host.constructor;

	BOUND_HOST_ATTRIBUTES_FOR_HOST.add(host, ...HOST_ATTRIBUTES_FOR_HOST.mapValue(constructor, hostAttributesCallback => {
			let observers: ReturnType<HostAttributesCallback>|null = hostAttributesCallback(host, hostAttributesHelperMap);
			return {
				unobserve: () => {
					if (observers != null) {
						observers.forEach(observer => observer.unobserve());
						observers = null;
					}
				},
				destroy: () => {
					if (observers != null) {
						observers.forEach(observer => "destroy" in observer ? observer.destroy() : observer.unobserve());
						observers = null;
					}
				}
			};
		}
	));
}