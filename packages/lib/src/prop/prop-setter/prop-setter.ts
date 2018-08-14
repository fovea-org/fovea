import {ICustomAttributeConstructor, IFoveaHostConstructor, IHostProp, Json, Optional} from "@fovea/common";
import {observe} from "../../observe/observe/observe/observe";
import {informObservers} from "../../observe/inform-observers/inform-observers";
import {setAttribute} from "../../attribute/set-attribute/set-attribute";
import {hostHasHostProp} from "../host-props-for-host/host-has-host-prop/host-has-host-prop";
import {getAttributeNameForPropName} from "../prop-name-to-attribute-name/get-attribute-name-for-prop-name/get-attribute-name-for-prop-name";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {emitEvent} from "../../event/emit-event";
import {getEventEmitterForHost} from "../../event/host-event-emitters-for-host/get-event-emitter-for-host";
import {AnyHost} from "../../host/any-host/any-host";
import {getChangeObserversForHost} from "../../change-observer/change-observers-for-host/get-change-observers-for-host";
import {hostIsStatic} from "../../host/host-is-static/host-is-static";
import {takeRelevantHost} from "../../host/take-relevant-host/take-relevant-host";
import {ProxyChangeHandler} from "../../observe/observe/observe/proxy-change-handler";
import {propHasBeenInitialized} from "../initialized-props-for-host/prop-has-been-initialized";
import {addInitializedPropForHost} from "../initialized-props-for-host/add-initialized-prop-for-host";
import {setExpectedAttributeValue} from "../../attribute/expected-attribute-value/set-expected-attribute-value/set-expected-attribute-value";

/**
 * This function is invoked when a new value is attempted to be set on a host
 * @param {AnyHost} host
 * @param {string} name
 * @param {Json} newValue
 * @param {boolean} isStatic
 * @param {boolean} propIsBooleanType
 * @returns {ProxyChangeHandler<T>|undefined}
 */
export function propSetter<T> (host: AnyHost, name: string, newValue: Json, isStatic: boolean, propIsBooleanType: boolean): ProxyChangeHandler<T>|undefined {

	// Take the old value
	const oldValue = (<Json>host)[`_${name}`];

	// Stop if the new value is identical to the old one
	if (oldValue != null && newValue === oldValue) return;

	// Define the change handler to use
	const changeHandler: ProxyChangeHandler<T> = change => informObservers(host, name, change);

	// Bind the new value to it - but wrap it inside 'observe' to also observe its children for changes
	const normalizedNewValue = observe(newValue, changeHandler);
	(<Json>host)[`_${name}`] = normalizedNewValue;

	// Inform observers of the change
	informObservers(host, name);

	// If the prop hasn't been set before and is anything else than 'undefined', mark it as initialized
	if (!propHasBeenInitialized(host, name) && normalizedNewValue !== undefined) {
		addInitializedPropForHost(host, name);
	}

	setAttributeIfNeeded(host, name, isStatic, normalizedNewValue, propIsBooleanType);
	invokeChangeObserversIfNeeded(host, name, isStatic, normalizedNewValue, oldValue);
	emitEventIfNeeded(host, name, isStatic, normalizedNewValue);

	return changeHandler;
}

/**
 * Invokes the host's change observers if any exists. Such ones exist if any method is annotated with the '@onChange' decorator
 * @param {AnyHost} host
 * @param {string} name
 * @param {boolean} isStatic
 * @param {Optional<Json>} newValue
 * @param {Optional<Json>} oldValue
 */
function invokeChangeObserversIfNeeded (host: AnyHost, name: string, isStatic: boolean, newValue: Optional<Json>, oldValue: Optional<Json>): void {
	// Format a proper prop
	const prop: IHostProp = {name, isStatic};

	// Take the constructor. It may be host itself if it is a constructor
	const constructor = hostIsStatic(host, prop.isStatic) ? host : <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;
	const relevantHost = takeRelevantHost(host, isStatic);
	const changeObservers = getChangeObserversForHost(constructor, prop);

	changeObservers.forEach(changeObserver => {
		let shouldInvoke: boolean = false;
		// If we don't care about whether or not all props are initialized, invoke the change listener immediately if it has been initialized before
		if (!changeObserver.whenAllAreInitialized) {
			// Check if the prop has been initialized previously
			shouldInvoke = propHasBeenInitialized(host, name);
		}

		// Otherwise, validate that each of the props has had a value previously
		else {
			if (changeObserver.props.every(changeObserverProp => propHasBeenInitialized(host, changeObserverProp))) {
				shouldInvoke = true;
			}
		}

		// Invoke if allowed
		if (shouldInvoke) {
			(<Json>relevantHost)[changeObserver.method.name].call(relevantHost, name, newValue, oldValue);
		}
	});
}

/**
 * Sets an attribute on the host if needed. It will be if the prop is annotated with a '@setOnHost' decorator
 * @param {AnyHost} host
 * @param {string} name
 * @param {boolean} isStatic
 * @param {Json} newValue
 * @param {boolean} propIsBooleanType
 */
function setAttributeIfNeeded (host: AnyHost, name: string, isStatic: boolean, newValue: Json, propIsBooleanType: boolean): void {
	// Format a proper prop
	const prop: IHostProp = {name, isStatic};

	// Take the constructor. It may be host itself if it is a constructor
	const constructor = hostIsStatic(host, prop.isStatic) ? host : <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;

	// Check if the value should be set on the host as an attribute and, if so, set it. Only do so if the prop is non-static (otherwise there is no host element)
	if (!hostIsStatic(host, prop.isStatic) && hostHasHostProp(constructor, prop)) {
		// Otherwise, first cache the new attribute value as the expected one. Otherwise, we may up believing the attribute was set from the outside
		const attributeName = getAttributeNameForPropName(name);
		const hostElement = getHostElementForHost(host);
		setExpectedAttributeValue(host, attributeName, newValue);

		setAttribute(host, hostElement, attributeName, newValue, propIsBooleanType);
	}
}

/**
 * Emits an event if needed. It will be needed if the prop is annotated with the '@emit' decorator
 * @param {AnyHost} host
 * @param {string} name
 * @param {boolean} isStatic
 * @param {Json} newValue
 */
function emitEventIfNeeded (host: AnyHost, name: string, isStatic: boolean, newValue: Json): void {
	// Format a proper prop
	const prop: IHostProp = {name, isStatic};

	// Take the constructor. It may be host itself if it is a constructor
	const constructor = hostIsStatic(host, prop.isStatic) ? host : <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;

	// Check if the host has an event emitter for the prop
	const emitter = getEventEmitterForHost(constructor, prop);

	// If it has one, and it has a name, resolve the target and emit an event on it
	if (emitter != null && emitter.name != null) {
		const emitterName = emitter.name;

		if (emitter.target != null) {
			// If a target has been provided, emit an event immediately
			emitEvent({value: newValue, target: emitter.target, name: emitterName});
		}

		// Otherwise, fire the event on the host element. If the prop is static, this is not possible in which case we do nothing
		else {
			if (!hostIsStatic(host, prop.isStatic)) {
				emitEvent({value: newValue, target: getHostElementForHost(host), name: emitterName});
			}
		}
	}
}