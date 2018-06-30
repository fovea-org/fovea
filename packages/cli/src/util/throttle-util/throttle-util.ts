import {IThrottleUtil} from "./i-throttle-util";

// tslint:disable:no-any

/**
 * A class that helps with throttling work
 */
export class ThrottleUtil implements IThrottleUtil {
	/**
	 * Contexts that are locked due to throttling
	 * @type {WeakSet<Object>}
	 */
	private readonly THROTTLE_LOCKED_CONTEXTS: WeakSet<{}> = new WeakSet();

	/**
	 * Current debounce timeouts
	 * @type {WeakMap<Object, number>}
	 */
	private readonly DEBOUNCE_TIMEOUTS: WeakMap<{}, number> = new WeakMap();

	/**
	 * Debounces execution of the given function on the given context
	 * @param {T} context
	 * @param {number} ms
	 * @param {Function} callback
	 */
	public debounce<T> (context: T, ms: number, callback: Function): void {
		const timeout = this.DEBOUNCE_TIMEOUTS.get(context);

		// Clear any existing timeout
		if (timeout !=  null) {
			clearTimeout(timeout);
		}

		// Execute the given callback after the provided amount of ms, unless the same context is provided to 'debounce' before then
		this.DEBOUNCE_TIMEOUTS.set(context, <number><any> setTimeout(() => {
			callback();
			this.DEBOUNCE_TIMEOUTS.delete(context);
		}, ms));

	}

	/**
	 * Throttles calling the given callback function by the given amount of milliseconds
	 * @param {T} context
	 * @param {number} ms
	 * @param {Function} callback
	 */
	public throttle<T> (context: T, ms: number, callback: Function): void {
		// If the context is locked, do nothing
		if (this.THROTTLE_LOCKED_CONTEXTS.has(context)) return;
		this.THROTTLE_LOCKED_CONTEXTS.add(context);

		// Invoke the callback
		callback();

		// Wait for the given amount of milliseconds before freeing the callback again
		setTimeout(() => this.THROTTLE_LOCKED_CONTEXTS.delete(context), ms);
	}
}