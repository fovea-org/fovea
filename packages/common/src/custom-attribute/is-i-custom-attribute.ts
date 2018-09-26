import {IFoveaHost} from "../fovea-host/i-fovea-host";
import {ICustomAttribute} from "./i-custom-attribute";

/**
 * Returns true if the provided IFoveaHost is an ICustomElement
 * @param {IFoveaHost} item
 * @returns {boolean}
 */
export function isICustomAttribute (item: IFoveaHost): item is ICustomAttribute {
	return !(item instanceof HTMLElement);
}