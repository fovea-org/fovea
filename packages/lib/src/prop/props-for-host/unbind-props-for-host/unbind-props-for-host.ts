import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {BOUND_PROPS_FOR_HOST} from "../bound-props-for-host/bound-props-for-host";

/*# IF hasProps */

/**
 * Unbinds all props from the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function unbindPropsForHost (host: IFoveaHost|ICustomAttribute): void {
	BOUND_PROPS_FOR_HOST.popAll(host, observer => observer.unobserve());
} /*# END IF hasProps */