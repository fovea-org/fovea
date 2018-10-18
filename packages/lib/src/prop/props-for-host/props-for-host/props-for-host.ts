import {FoveaHostConstructor, IProp, WeakMultiMap} from "@fovea/common";

/**
 * A map between hosts and their IProps
 * @type {WeakMultiMap<FoveaHostConstructor, IProp[]>}
 */
export const PROPS_FOR_HOST: WeakMultiMap<FoveaHostConstructor, IProp> = new WeakMultiMap();