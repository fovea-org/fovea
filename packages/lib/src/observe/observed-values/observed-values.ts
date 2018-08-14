import {WeakMultiMap} from "../../multi-map/weak-multi-map";
import {ProxyChangeHandler} from "../observe/observe/proxy-change-handler";

/**
 * A map between observed values and their proxies
 * @type {WeakMap<{}, {}>}
 */
export const valueToProxy: WeakMap<{}, {}> = new WeakMap();
/**
 * A map between proxies and their observed values
 * @type {WeakMap<{}, {}>}
 */
export const proxyToValue: WeakMap<{}, {}> = new WeakMap();

/**
 * The subscribed change handlers for observed values
 * @type {WeakMultiMap<{}, ProxyChangeHandler<{}>>}
 */
export const observedValueChangeHandlers: WeakMultiMap<{}, ProxyChangeHandler<{}>> = new WeakMultiMap();

/**
 * The subscribed change handlers for observed values - reversed
 * @type {WeakMultiMap<ProxyChangeHandler<{}>, {}>}
 */
export const observedValueChangeHandlersReversed: WeakMultiMap<ProxyChangeHandler<{}>, {}> = new WeakMultiMap();

/**
 * Adds a handler for an observed value
 * @param {T} value
 * @param {T} proxy
 * @param {ProxyChangeHandler<T>} handler
 */
export function addObservedValue<T> (value: T, proxy: T, handler: ProxyChangeHandler<T>): void {
	valueToProxy.set(value, proxy);
	valueToProxy.set(proxy, proxy);
	proxyToValue.set(proxy, value);
	proxyToValue.set(value, value);

	observedValueChangeHandlers.add(proxy, handler);
	observedValueChangeHandlersReversed.add(handler, proxy);
}

/**
 * Removes a proxy change handler
 * @param {ProxyChangeHandler<T>} handler
 */
export function deleteProxyChangeHandler<T> (handler: ProxyChangeHandler<T>): void {
	observedValueChangeHandlersReversed.popAll(handler, proxy => {
		observedValueChangeHandlers.deleteValue(proxy, handler);

		if (observedValueChangeHandlers.sizeForKey(proxy) < 1) {
			const valueForProxy = proxyToValue.get(proxy);
			const proxyForValue = valueToProxy.get(proxy);

			if (proxyForValue != null) {
				valueToProxy.delete(proxyForValue);
				proxyToValue.delete(proxyForValue);
			}

			if (valueForProxy != null) {
				valueToProxy.delete(valueForProxy);
				proxyToValue.delete(valueForProxy);
			}
		}
	});
}