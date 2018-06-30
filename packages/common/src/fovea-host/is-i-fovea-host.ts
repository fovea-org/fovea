import {IFoveaHost} from "./i-fovea-host";
import {ICustomAttribute} from "../custom-attribute/i-custom-attribute";

/**
 * Returns true if the provided item is an IFoveaHost
 * @param {IFoveaHost | ICustomAttribute} item
 * @returns {boolean}
 */
export function isIFoveaHost (item: IFoveaHost|ICustomAttribute): item is IFoveaHost {
	return item instanceof HTMLElement;
}