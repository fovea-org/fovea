import {AnyHost} from "../../host/any-host/any-host";
import {INITIALIZED_PROPS_FOR_HOST} from "./initialized-props-for-host";

/*# IF hasProps */

/**
 * Adds the given prop to the map of initialized props for the given host
 * @param {AnyHost} host
 * @param {string} propName
 */
export function addInitializedPropForHost (host: AnyHost, propName: string): void {
	INITIALIZED_PROPS_FOR_HOST.add(host, propName);
} /*# END IF hasProps */