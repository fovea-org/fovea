import {ICustomElement} from "./i-custom-element";
import {IFoveaHost} from "../fovea-host/i-fovea-host";

/**
 * Returns true if the provided IFoveaHost is an ICustomElement
 * @param {IFoveaHost} item
 * @returns {boolean}
 */
export function isICustomElement (item: IFoveaHost): item is ICustomElement {
	return item instanceof HTMLElement;
}