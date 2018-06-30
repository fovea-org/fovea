import {valueToProxy} from "../observed-values/observed-values";

/*# IF hasProps */

/**
 * Returns true if the provided value is ObjectLike
 * @param {T} value
 * @returns {boolean}
 */
export function isObjectLike<T> (value: T): boolean {
	return value != null && (
		Array.isArray(value) || value.constructor === {}.constructor
	);
}

/**
 * Returns true if the given value can be observed
 * @param {T} value
 * @returns {boolean}
 */
export function canBeObserved<T> (value: T): boolean {
	return isObjectLike(value);
}

/**
 * Returns true if the given value is already being observed
 * @param {T} value
 * @returns {boolean}
 */
export function isObserved<T> (value: T): boolean {
	return getObservedProxy(value) != null;
}

/**
 * Returns true if the given value is already being observed
 * @param {T} value
 * @returns {boolean}
 */
export function getObservedProxy<T> (value: T): T|undefined {
	return <T|undefined> valueToProxy.get(value);
} /*# END IF hasProps */