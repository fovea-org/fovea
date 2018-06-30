import {IPath} from "./i-path";

// tslint:disable:no-any

/**
 * Returns true if the given item is an IPath
 * @param {*} item
 * @returns {boolean}
 */
export function isIPath (item: any): item is IPath {
	if (item == null) return false;
	return Object.keys(item).length === 2 && "absolute" in item && "relative" in item;
}