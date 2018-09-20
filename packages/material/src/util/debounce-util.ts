// tslint:disable:no-any

declare function cancelIdleCallback (id: number): void;
declare function requestIdleCallback<T> (callback: T): number;

/**
 * A WeakMap between callback functions and their timeout ids.
 * @type {Map<Function, number>}
 */
const DEBOUNCED_CALLBACKS: WeakMap<Function, number> = new WeakMap();

/**
 * Debounces the execution of the given callback with the provided scheduler
 * @param {T} callback
 * @param {Function} scheduler
 * @param {Function} cancelScheduler
 * @param {number} ms
 * @returns {number}
 */
export function debounceCommon<T extends Function> (callback: T, scheduler: Function, cancelScheduler: Function, ms?: number): number {
	const existingTimeoutId = DEBOUNCED_CALLBACKS.get(callback);

	if (existingTimeoutId != null) {
		cancelScheduler(existingTimeoutId);
	}

	const timeout = scheduler(() => {
		callback();
		DEBOUNCED_CALLBACKS.delete(callback);
	}, ms);

	DEBOUNCED_CALLBACKS.set(callback, timeout);
	return timeout;
}

/**
 * Debounces the execution of the given callback for the given amount of ms
 * @param {T} callback
 * @param {number} ms
 * @returns {number}
 */
export function debounce<T extends Function> (callback: T, ms: number): number {
	return debounceCommon(callback, setTimeout, clearTimeout, ms);
}

/**
 * Debounces the execution of the given callback until the main thread is idle
 * @param {T} callback
 * @returns {number}
 */
export function debounceUntilIdle<T extends Function> (callback: T): number {
	return debounceCommon(callback, requestIdleCallback, cancelIdleCallback);
}

/**
 * Debounces the execution of the given callback until immediately before the next animation frame
 * @param {T} callback
 * @returns {number}
 */
export function debounceUntilNextAnimationFrame<T extends Function> (callback: T): number {
	return debounceCommon(callback, requestAnimationFrame, cancelAnimationFrame);
}