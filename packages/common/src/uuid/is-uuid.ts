import {Uuid} from "./uuid";
import {ICustomAttribute, ICustomAttributeConstructor} from "../custom-attribute/i-custom-attribute";
import {IFoveaHostConstructor} from "../fovea-host/i-fovea-host";

/**
 * Returns true if the provided item is a UUID
 * @param {Node | ICustomAttribute | Uuid} item
 * @returns {boolean}
 */
export function isUuid (item: Node|ICustomAttribute|IFoveaHostConstructor|ICustomAttributeConstructor|Uuid): item is Uuid {
	return item != null && typeof item === "number";
}