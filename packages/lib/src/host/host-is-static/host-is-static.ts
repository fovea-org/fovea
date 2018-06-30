import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {AnyHost} from "../any-host/any-host";

/**
 * A predicate function that casts the given host to an IFoveaHostConstructor or ICustomAttributeConstructor if "isStatic" is true
 * @param {AnyHost} _host
 * @param {boolean} isStatic
 * @returns {boolean}
 */
export function hostIsStatic (_host: AnyHost, isStatic: boolean): _host is IFoveaHostConstructor|ICustomAttributeConstructor {
	return isStatic;
}