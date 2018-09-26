import {FoveaHostConstructor, IProp} from "@fovea/common";
import {WeakMultiMap} from "../../../multi-map/weak-multi-map";

/**
 * A map between hosts and their IProps
 * @type {WeakMultiMap<FoveaHostConstructor, IProp[]>}
 */
export const PROPS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, IProp> = new WeakMultiMap();