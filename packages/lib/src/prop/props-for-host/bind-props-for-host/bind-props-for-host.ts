import {ICustomAttribute, ICustomAttributeConstructor, IFoveaHost, IFoveaHostConstructor, Json} from "@fovea/common";
import {BOUND_PROPS_FOR_HOST} from "../bound-props-for-host/bound-props-for-host";
import {PROPS_FOR_HOST} from "../props-for-host/props-for-host";
import {takeRelevantHost} from "../../../host/take-relevant-host/take-relevant-host";
import {AnyHost} from "../../../host/any-host/any-host";
import {propGetter} from "../../prop-getter/prop-getter";
import {propSetter} from "../../prop-setter/prop-setter";
import {ProxyChangeHandler} from "../../../observe/observe/observe/proxy-change-handler";
import {deleteProxyChangeHandler} from "../../../observe/observed-values/observed-values";
import {INITIALIZED_PROPS_FOR_HOST} from "../../initialized-props-for-host/initialized-props-for-host";
import {isBooleanType} from "../../type-for-prop-name/get-type-for-prop-name";

/*# IF hasProps */

/**
 * Binds all props for the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function bindPropsForHost (host: IFoveaHost|ICustomAttribute): void {

	const constructor = <IFoveaHostConstructor|ICustomAttributeConstructor> host.constructor;

	BOUND_PROPS_FOR_HOST.add(host, ...PROPS_FOR_HOST.mapValue(constructor, ({name, isStatic, type}) => {
			const relevantHost = takeRelevantHost(host, isStatic);
			let oldProxyChangeHandler: ProxyChangeHandler<{}>|null = null;

			// Take the initialized value, if any
			const initializedValue = (<Json>relevantHost)[name];

			// Define a getter/setter that will observe the prop
			Object.defineProperty(relevantHost, name, {

				/**
				 * Gets the current value of the prop
				 * @returns {*}
				 */
				get () {
					return propGetter(<AnyHost>this, name);
				},

				/**
				 * Sets the value of the prop. Will deep-observe it and invoke 'informObservers' when either
				 * it or any of its child properties mutate
				 * @param newValue
				 */
				set (newValue) {
					const newProxyChangeHandler = propSetter(<AnyHost>this, name, newValue, isStatic, isBooleanType(type));

					if (newProxyChangeHandler != null) {

						// If the proxy change handler has changed, make sure to delete the old one
						if (newProxyChangeHandler !== oldProxyChangeHandler && oldProxyChangeHandler != null) {
							deleteProxyChangeHandler(oldProxyChangeHandler);
						}

						// Reassign the proxy change handler
						oldProxyChangeHandler = newProxyChangeHandler;
					}
				},
				enumerable: true,
				configurable: true
			});

			// Set the initial value immediately
			propSetter(relevantHost, name, initializedValue, isStatic, isBooleanType(type));

			// When unobserving, remove the property descriptors for the prop
			return {
				unobserve: () => {
					// Remove property descriptors
					Object.defineProperty(relevantHost, name, {value: (<Json>relevantHost)[name], configurable: true, enumerable: true, writable: true});

					if (oldProxyChangeHandler != null) {
						deleteProxyChangeHandler(oldProxyChangeHandler);
						oldProxyChangeHandler = null;
					}

					// Clear all initialized props for the host
					INITIALIZED_PROPS_FOR_HOST.delete(host);
				}
			};
		}
	));
}

/*# END IF hasProps */