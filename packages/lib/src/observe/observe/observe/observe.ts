import {canBeObserved, getObservedProxy, isObserved} from "../../can-be-observed/can-be-observed";
import {addObservedValue, observedValueChangeHandlers} from "../../observed-values/observed-values";
import {takeObservablePropertyKeys} from "../../take-observable-property-keys/take-observable-property-keys";
import {ArrayChange, ChangePath, ObjectChange} from "../change/change";
import {ChangeKind} from "../change-kind/change-kind";
import {Json} from "@fovea/common";
import {ProxyChangeHandler} from "./proxy-change-handler";
import {ProxyObjectChangeHandler} from "./proxy-object-change-handler";

/**
 * Observes all children (e.g. nested ObjectLikes) of the given value
 * @template T extends object, U, V extends U[]
 * @param {T|V} value
 * @param {ProxyChangeHandler<T|V>} changeHandler
 * @param {ChangePath} path
 * @param {T|V} originalTarget
 */
function observeChildren<T extends object, U, V extends U[]> (value: T|V, changeHandler: ProxyChangeHandler<T|V>, path: ChangePath, originalTarget: T|V): void {
	takeObservablePropertyKeys(value).forEach((childKey: keyof (T|V)) => {
		const observer = observe(<Json> value[childKey], changeHandler, <string[]> [...path, childKey], originalTarget);
		if (!isObserved(value[childKey])) {
			(<Json>value)[childKey] = observer;
		}
	});
}

/**
 * Formats an ArrayChange
 * @template T, U extends T[]
 * @param {U} target
 * @param {number | string} key
 * @param {T} newValue
 * @param {number} oldLength
 * @param {ChangePath} path
 * @param {U} proxyTarget
 * @param {U} originalTarget
 * @returns {ArrayChange<U>|undefined}
 */
function formatArrayChange<T, U extends T[]> (target: U, key: keyof U, newValue: T|U[keyof U], oldLength: number, path: ChangePath, proxyTarget: U, originalTarget: U): ArrayChange<T>|undefined {
	// Check if the length has changed
	const lengthChanged = target.length !== oldLength;

	// If the length didn't change, an array member simply changed its' value on a specific position
	if (!lengthChanged) {

		// If the key is 'length', skip it
		if (key === "length") return undefined;

		// Otherwise, return a Change
		return {
			kind: ChangeKind.UPDATE,
			property: parseInt(<string>key),
			newValue: <Json> newValue,
			path,
			target: proxyTarget,
			originalTarget
		};
	}

	// Otherwise, check if we're having to do with a pop
	const isPop = key === "length" && <Json> newValue < oldLength;

	if (isPop) {
		return {
			kind: ChangeKind.POP,
			property: oldLength - 1,
			path,
			target: proxyTarget,
			originalTarget
		};
	}

	// Otherwise, we're having to do with a splice
	return {
		kind: ChangeKind.SPLICE,
		property: key === "length" ? <Json>newValue - 1 : parseInt(<string> key),
		newValue: key === "length" ? <Json> target[<Json>newValue - 1] : newValue,
		path,
		target: proxyTarget,
		originalTarget
	};
}

/**
 * Formats an ObjectChange
 * @template T
 * @param {string} key
 * @param {*} newValue
 * @param {ChangePath} path
 * @param {T} proxyTarget
 * @param {T} originalTarget
 * @returns {ObjectChange<T extends object>}
 */
function formatObjectChange<T extends object> (key: keyof T, newValue: T[keyof T], path: ChangePath, proxyTarget: T, originalTarget: T): ObjectChange<T> {
	return {
		kind: ChangeKind.UPDATE,
		newValue,
		property: <string> key,
		path,
		target: proxyTarget,
		originalTarget
	};
}

/**
 * Observes the given value. Invokes the given ChangeHandler when it changes
 * @template T extends object, U, V extends U[]
 * @param {T|V} value
 * @param {ProxyChangeHandler<T|V>} changeHandler
 * @param {ChangePath} [path=[]]
 * @param {T|V} [originalTarget]
 * @returns {T|V}
 */
export function observe<T extends object, U, V extends U[]> (value: T|V, changeHandler: ProxyChangeHandler<T|V>, path: ChangePath = [], originalTarget: T|V = value): T|V {

	// If the provided value cannot be observed, return the value the function was provided with
	if (!canBeObserved(value)) return value;

	// If the value is an array, use the Array observer
	if (Array.isArray(value)) {
		return observeArray(value, changeHandler, path, <V> originalTarget);
	}

	// Otherwise, fall back to the object observer
	else {
		return observeObject(value, changeHandler, path, originalTarget);
	}
}

/**
 * Observes the given object. Invokes the given ChangeHandler when it changes
 * @param {T} value
 * @param {ProxyObjectChangeHandler<T>} changeHandler
 * @param {ChangePath} path
 * @param {T} originalTarget
 * @returns {T}
 */
function observeObject<T extends object> (value: T, changeHandler: ProxyObjectChangeHandler<T>, path: ChangePath, originalTarget: T): T {
	// Mutate its' children with proxies
	observeChildren(value, changeHandler, path, originalTarget);

	// If the value is already observed, simply add the change handler to its' listeners
	if (isObserved(value)) {
		const observedProxy = getObservedProxy(value)!;
		addObservedValue(value, observedProxy, changeHandler);
		return observedProxy;
	}

	const proxy = new Proxy(value, {
		set: (target: T, key: keyof T, newValue: T[keyof T]) => {

			// Set the value on the target. Add an observer for the new value if it can be observed. Otherwise, set the value directly
			if (canBeObserved(newValue)) {
				target[key] = <Json> observe(<Json> newValue, changeHandler, path, originalTarget);
			}
			else {
				target[key] = newValue;
			}

			// Refresh all observed children
			observeChildren(proxy, changeHandler, path, originalTarget);

			// Format the change
			const change = formatObjectChange(key, newValue, path, proxy, originalTarget);

			// Defer the call of the changeHandler
			Promise.resolve().then(() => {
				// Invoke all change observers
				observedValueChangeHandlers.forEach(proxy, handler => handler(change));
			});

			return true;
		}
	});

	// Add the raw value as well as its proxy to the Set of observed values
	addObservedValue(value, proxy, changeHandler);
	return proxy;
}

/**
 * Observes the given array. Invokes the given ChangeHandler when it changes
 * @param {T, U} value
 * @param {ProxyChangeHandler<T|U>} changeHandler
 * @param {ChangePath} path
 * @param {U} originalTarget
 * @returns {object}
 */
function observeArray<T, U extends T[]> (value: U, changeHandler: ProxyChangeHandler<T|U>, path: ChangePath, originalTarget: U): U {
	// Mutate its' children with proxies
	observeChildren(value, changeHandler, path, originalTarget);

	// If the value is already observed, simply add the change handler to its' listeners
	if (isObserved(value)) {
		const observedProxy = getObservedProxy(value)!;
		addObservedValue(value, observedProxy, changeHandler);
		return observedProxy;
	}

	const proxy = new Proxy(value, {
		set: (target: U, key: keyof U, newValue: T) => {
			const oldLength = target.length;

			// Set the value on the target. Add an observer for the new value if it can be observed. Otherwise, set the value directly
			if (canBeObserved(newValue)) {
				target[key] = <Json> observe(newValue, changeHandler, path, originalTarget);
			}
			else {
				target[key] = <Json> newValue;
			}

			// Update the children. New ones may have arrived which may require proxies
			observeChildren(proxy, changeHandler, path, originalTarget);

			// Defer the call of the changeHandler
			Promise.resolve().then(() => {
				// Format the change
				const change = formatArrayChange(target, key, newValue, oldLength, path, proxy, originalTarget);
				if (change != null) {

					// Flatten all change handlers for this observed value and invoke them
					// Invoke all change observers
					observedValueChangeHandlers.forEach(proxy, (handler: ProxyChangeHandler<T|U>) => handler(change));
				}
			});

			return true;
		}
	});

	// Add the raw value as well as its proxy to the Set of observed values
	addObservedValue(value, proxy, changeHandler);
	return proxy;
}