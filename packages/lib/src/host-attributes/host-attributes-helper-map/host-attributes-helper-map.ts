import {IHostAttributesHelperMap} from "./i-host-attributes-helper-map";
import {IObserver} from "../../observe/i-observer";
import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";
import {ExpressionChain, FoveaHost, Ref} from "@fovea/common";
import {observeAttribute} from "../../attribute/observe-attribute/observe-attribute";
import {attachCustomAttribute} from "../../custom-attribute/attach-custom-attribute/attach-custom-attribute";
import {observeProperty} from "../../prop/observe-property/observe-property";
import {addRef} from "../../ref/add-ref/add-ref";
import {observeListener} from "../../listener/observe-listener/observe-listener";
import {IDestroyable} from "../../destroyable/i-destroyable";

// tslint:disable:no-identical-functions

/**
 * Adds the given ExpressionChain or IExpressionChainDict to the given host as an attribute
 * @param {FoveaHost} host
 * @param {string} key
 * @param {ExpressionChain|IExpressionChainDict} [value]
 * @returns {IObserver}
 */
function addAttributeForHost (host: FoveaHost, key: string, value?: ExpressionChain|IExpressionChainDict): IObserver {
	return observeAttribute(host, host.___hostElement, {key, value});
}

/**
 * Adds the given ExpressionChain to the given host as a property
 * @param {FoveaHost} host
 * @param {string} path
 * @param {ExpressionChain} [value]
 * @returns {IObserver}
 */
function addPropertyForHost (host: FoveaHost, path: string, value?: ExpressionChain): IObserver {
	return observeProperty(host, host.___hostElement, {key: path, value});
}

/**
 * Adds all of the provided attributes to the given host
 * @param {FoveaHost} host
 * @param {[string, (ExpressionChain | undefined)][]} attributes
 * @returns {IObserver}
 */
function addAttributesForHost (host: FoveaHost, ...attributes: [string, ExpressionChain|undefined][]): IObserver {
	let observers: IObserver[]|null = attributes.map(([key, value]) => addAttributeForHost(host, key, value));
	return {
		unobserve: () => {
			if (observers != null) {
				observers.forEach(observer => observer.unobserve());
				observers = null;
			}
		}
	};
}

/**
 * Adds all of the provided properties to the given host
 * @param {FoveaHost} host
 * @param {[string, (ExpressionChain | undefined)][]} properties
 * @returns {IObserver}
 */
function addPropertiesForHost (host: FoveaHost, ...properties: [string, ExpressionChain][]): IObserver {
	let observers: IObserver[]|null = properties.map(([path, value]) => addPropertyForHost(host, path, value));
	return {
		unobserve: () => {
			if (observers != null) {
				observers.forEach(observer => observer.unobserve());
				observers = null;
			}
		}
	};
}

/**
 * Binds an event listener to the given host for events of the given name and with the given handler
 * @param {FoveaHost} host
 * @param {string} name
 * @param {ExpressionChain} handler
 * @returns {IObserver}
 */
function addListenerForHost (host: FoveaHost, name: string, handler: ExpressionChain): IObserver {
	return observeListener(host, host.___hostElement, {name, handler});
}

/**
 * Adds all of the provided listeners to the given host
 * @param {FoveaHost} host
 * @param {[string, (ExpressionChain)][]} listeners
 * @returns {IObserver}
 */
function addListenersForHost (host: FoveaHost, ...listeners: [string, ExpressionChain][]): IObserver {
	let observers: IObserver[]|null = listeners.map(([name, value]) => addListenerForHost(host, name, value));
	return {
		unobserve: () => {
			if (observers != null) {
				observers.forEach(observer => observer.unobserve());
				observers = null;
			}
		}
	};
}

/**
 * Adds the given Custom Attribute to the given host
 * @param {FoveaHost} host
 * @param {string} name
 * @param {ExpressionChain | IExpressionChainDict} value
 * @returns {IObserver & IDestroyable}
 */
function addCustomAttributeForHost (host: FoveaHost, name: string, value?: ExpressionChain|IExpressionChainDict): IObserver&IDestroyable {
	return attachCustomAttribute(host, host.___hostElement, name, value);
}

/**
 * Adds the given Custom Attribute to the given host
 * @param {FoveaHost} host
 * @param {Ref} ref
 * @returns {IObserver}
 */
function addRefForHost (host: FoveaHost, ref: Ref): IObserver {
	return addRef(host, host.___hostElement, ref);
}

export const hostAttributesHelperMap: IHostAttributesHelperMap = {
	___addAttributes: addAttributesForHost,
	___addAttribute: addAttributeForHost,
	___addProperties: addPropertiesForHost,
	___addProperty: addPropertyForHost,
	___addRef: addRefForHost,
	___addListeners: addListenersForHost,
	___addListener: addListenerForHost,
	___addCustomAttribute: addCustomAttributeForHost
};