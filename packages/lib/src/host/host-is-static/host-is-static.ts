import {FoveaHostConstructor} from "@fovea/common";
import {AnyHost} from "../any-host/any-host";

/**
 * A predicate function that casts the given host to an FoveaHostConstructor if "isStatic" is true
 * @param {AnyHost} _host
 * @param {boolean} isStatic
 * @returns {boolean}
 */
export function hostIsStatic (_host: AnyHost, isStatic: boolean): _host is FoveaHostConstructor {
	return isStatic;
}