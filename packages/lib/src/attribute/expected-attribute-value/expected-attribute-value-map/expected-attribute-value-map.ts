import {FoveaHost} from "@fovea/common";

/**
 * A map between FoveaHosts and a map between attribute names and their expected values
 * @type {WeakMap<FoveaHost, Map<string, string>>}
 */
export const EXPECTED_ATTRIBUTE_VALUE_MAP: WeakMap<FoveaHost, Map<string, string>> = new WeakMap();