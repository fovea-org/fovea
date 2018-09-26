import {isICustomElement} from "../custom-element/is-i-custom-element";
import {isICustomAttribute} from "../custom-attribute/is-i-custom-attribute";
import {FoveaHost} from "./fovea-host";

// tslint:disable:no-any

/**
 * Returns true if the provided item is a FoveaHost
 * @param {*} item
 * @returns {boolean}
 */
export function isFoveaHost (item: any): item is FoveaHost {
	return isICustomElement(item) || isICustomAttribute(item);
}