import {MaybeArray} from "@fovea/common";

/**
 * Ensures that the given item is an array
 * @param {MaybeArray<T>} item
 * @returns {T[]}
 */
export function ensureArray<T> (item: MaybeArray<T>): T[] {
	return Array.isArray(item) ? item : [item];
}