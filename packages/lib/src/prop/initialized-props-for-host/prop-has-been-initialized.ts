import {AnyHost} from "../../host/any-host/any-host";
import {INITIALIZED_PROPS_FOR_HOST} from "./initialized-props-for-host";

/*# IF hasProps */

/**
 * Returns true if the given prop has been initialized on the given host
 * @param {AnyHost} host
 * @param {string} propName
 * @returns {boolean}
 */
export function propHasBeenInitialized (host: AnyHost, propName: string): boolean {
	return INITIALIZED_PROPS_FOR_HOST.someValue(host, initializedPropName => initializedPropName === propName);
} /*# END IF hasProps */