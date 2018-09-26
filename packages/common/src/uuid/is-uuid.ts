import {Uuid} from "./uuid";
import {FoveaHost, FoveaHostConstructor} from "../fovea-host/fovea-host";

/**
 * Returns true if the provided item is a UUID
 * @param {Node | ICustomAttribute | Uuid} item
 * @returns {boolean}
 */
export function isUuid (item: Node|FoveaHost|FoveaHostConstructor|Uuid): item is Uuid {
	return item != null && typeof item === "number";
}