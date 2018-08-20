import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {AnyHost} from "../any-host/any-host";
import {hostIsStatic} from "../host-is-static/host-is-static";

/**
 * Takes either the host or its constructor, depending on the truthiness of the "isStatic" argument
 * @param {AnyHost} host
 * @param {boolean} isStatic
 * @returns {AnyHost}
 */
export function takeRelevantHost (host: AnyHost, isStatic: boolean): AnyHost {
	return isStatic ? hostIsStatic(host, isStatic) ? host : <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor : host;
}