import {ICustomAttribute, IFoveaHost} from "@fovea/common";

/**
 * A map between IFoveaHosts and a map between attribute names and their expected values
 * @type {WeakMap<IFoveaHost|ICustomAttribute, Map<string, string>>}
 */
export const EXPECTED_ATTRIBUTE_VALUE_MAP: WeakMap<IFoveaHost|ICustomAttribute, Map<string, string>> = new WeakMap();