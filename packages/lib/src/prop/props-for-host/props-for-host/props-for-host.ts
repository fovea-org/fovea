import {ICustomAttributeConstructor, IFoveaHostConstructor, IProp} from "@fovea/common";
import {WeakMultiMap} from "../../../multi-map/weak-multi-map";

/*# IF hasProps */

/**
 * A map between hosts and their IProps
 * @type {WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, IProp[]>}
 */
export const PROPS_FOR_HOST: WeakMultiMap<IFoveaHostConstructor|ICustomAttributeConstructor, IProp> = new WeakMultiMap(); /*# END IF hasProps */