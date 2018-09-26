import {FoveaHostConstructor, IHostProp} from "@fovea/common";
import {HOST_PROPS_FOR_HOST} from "../host-props-for-host";

/**
 * Returns true if the given host has the given host prop
 * @param {FoveaHostConstructor} host
 * @param {IHostProp} prop
 * @returns {boolean}
 */
export function hostHasHostProp (host: FoveaHostConstructor, prop: IHostProp): boolean {

	// Check if any of them is identical
	return HOST_PROPS_FOR_HOST.someValue(host, ({name, isStatic}) => {
		return name === prop.name && isStatic === prop.isStatic;
	});
}