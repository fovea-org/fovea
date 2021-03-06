import {FoveaHostConstructor, IProp} from "@fovea/common";
import {PROPS_FOR_HOST} from "../props-for-host/props-for-host";

/**
 * Adds the given prop(s) to the Map of props for the host
 * @param {FoveaHostConstructor} host
 * @param {IProp[]|IProp} prop
 */
export function addPropsForHost (host: FoveaHostConstructor, prop: IProp[]|IProp): void {
	PROPS_FOR_HOST.add(host, ...(Array.isArray(prop) ? prop : [prop]));
}