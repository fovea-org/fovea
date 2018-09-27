// tslint:disable:no-any

/**
 * A WeakMap between callback functions and their timeout ids.
 * @type {Map<Function|string, number>}
 */
const DEBOUNCED_CALLBACKS: Map<Function|string, number> = new Map();

/**
 * Debounces the execution of the given callback for the given amount of ms
 * @param {T} callback
 * @param {number} ms
 * @param {string} [id]
 * @returns {number}
 */
export function debounce<T extends Function> (callback: T, ms: number = 16, id?: string): number {
	const key = id != null ? id : callback;
	const existingTimeoutId = DEBOUNCED_CALLBACKS.get(key);

	if (existingTimeoutId != null) {
		clearTimeout(existingTimeoutId);
	}

	const timeout = <number><any> setTimeout(() => {
		callback();
		DEBOUNCED_CALLBACKS.delete(key);
	}, ms);

	DEBOUNCED_CALLBACKS.set(key, timeout);
	return timeout;
}