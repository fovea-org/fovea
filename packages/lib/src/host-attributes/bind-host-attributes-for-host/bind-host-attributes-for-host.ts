import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor} from "@fovea/common";
import {BOUND_HOST_ATTRIBUTES_FOR_HOST} from "../bound-host-attributes-for-host/bound-host-attributes-for-host";
import {HOST_ATTRIBUTES_FOR_HOST} from "../host-attributes-for-host/host-attributes-for-host";
import {hostAttributesHelperMap} from "../host-attributes-helper-map/host-attributes-helper-map";
import {IObserver} from "../../observe/i-observer";

/*# IF hasHostAttributes */

/**
 * Binds all host attributes for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function bindHostAttributesForHost (host: IFoveaHost|ICustomAttribute): void {

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;

	BOUND_HOST_ATTRIBUTES_FOR_HOST.add(host, ...HOST_ATTRIBUTES_FOR_HOST.mapValue(constructor, hostAttributesCallback => {
		let observers: IObserver[]|null = hostAttributesCallback(host, hostAttributesHelperMap);
			return {
				unobserve: () => {
					if (observers != null) {
						observers.forEach(observer => observer.unobserve());
						observers = null;
					}
				}
			};
		}
	));
}

/*# END IF hasHostAttributes */