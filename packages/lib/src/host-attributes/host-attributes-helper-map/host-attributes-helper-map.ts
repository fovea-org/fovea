import {IHostAttributesHelperMap} from "./i-host-attributes-helper-map";
import {IObserver} from "../../observe/i-observer";
import {IExpressionChainDict} from "../../observe/expression-chain/i-expression-chain-dict";
import {IFoveaHost, ICustomAttribute, ExpressionChain, Ref} from "@fovea/common";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";
import {observeAttribute} from "../../attribute/observe-attribute/observe-attribute";
import {attachCustomAttribute} from "../../custom-attribute/attach-custom-attribute/attach-custom-attribute";
import {observeProperty} from "../../prop/observe-property/observe-property";
import {addRef} from "../../ref/add-ref/add-ref";
import {observeListener} from "../../listener/observe-listener/observe-listener";

/*# IF hasHostAttributes && hasTemplateAttributes */

/**
 * Adds the given ExpressionChain or IExpressionChainDict to the given host as an attribute
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {string} key
 * @param {ExpressionChain|IExpressionChainDict} [value]
 * @returns {IObserver}
 */
function addAttributeForHost (host: IFoveaHost|ICustomAttribute, key: string, value?: ExpressionChain|IExpressionChainDict): IObserver {
	return observeAttribute(host, getHostElementForHost(host), {key, value});
}

/**
 * Adds the given ExpressionChain to the given host as a property
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {string} path
 * @param {ExpressionChain} [value]
 * @returns {IObserver}
 */
function addPropertyForHost (host: IFoveaHost|ICustomAttribute, path: string, value?: ExpressionChain): IObserver {
	return observeProperty(host, getHostElementForHost(host), {key: path, value});
}

/**
 * Adds all of the provided attributes to the given host
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {[string, (ExpressionChain | undefined)][]} attributes
 * @returns {IObserver}
 */
function addAttributesForHost (host: IFoveaHost|ICustomAttribute, ...attributes: [string, ExpressionChain|undefined][]): IObserver {
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
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {[string, (ExpressionChain | undefined)][]} properties
 * @returns {IObserver}
 */
function addPropertiesForHost (host: IFoveaHost|ICustomAttribute, ...properties: [string, ExpressionChain][]): IObserver {
	let observers: IObserver[]|null = properties.map(([path, value]) => addPropertyForHost(host, path, value));
	return {
		unobserve: () => {
			if (observers != null) {
				observers.forEach(observer => observer.unobserve());
				observers = null;
			}
		}
	};
} /*# END IF hasHostAttributes && hasTemplateAttributes */

/*# IF hasHostAttributes && hasTemplateListeners */

/**
 * Binds an event listener to the given host for events of the given name and with the given handler
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {string} name
 * @param {ExpressionChain} handler
 * @returns {IObserver}
 */
function addListenerForHost (host: IFoveaHost|ICustomAttribute, name: string, handler: ExpressionChain): IObserver {
	return observeListener(host, getHostElementForHost(host), {name, handler});
}

/**
 * Adds all of the provided listeners to the given host
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {[string, (ExpressionChain)][]} listeners
 * @returns {IObserver}
 */
function addListenersForHost (host: IFoveaHost|ICustomAttribute, ...listeners: [string, ExpressionChain][]): IObserver {
	let observers: IObserver[]|null = listeners.map(([name, value]) => addListenerForHost(host, name, value));
	return {
		unobserve: () => {
			if (observers != null) {
				observers.forEach(observer => observer.unobserve());
				observers = null;
			}
		}
	};
} /*# END IF hasHostAttributes && hasTemplateListeners */

/*# IF hasHostAttributes && hasTemplateCustomAttributes */

/**
 * Adds the given Custom Attribute to the given host
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {string} name
 * @param {ExpressionChain | IExpressionChainDict} value
 * @returns {IObserver}
 */
function addCustomAttributeForHost (host: IFoveaHost|ICustomAttribute, name: string, value?: ExpressionChain|IExpressionChainDict): IObserver {
	return attachCustomAttribute(host, getHostElementForHost(host), name, value);
} /*# END IF hasHostAttributes && hasTemplateCustomAttributes */

/*# IF hasHostAttributes && hasTemplateRefs */

/**
 * Adds the given Custom Attribute to the given host
 * @param {IFoveaHost | ICustomAttribute} host
 * @param {Ref} ref
 * @returns {IObserver}
 */
function addRefForHost (host: IFoveaHost|ICustomAttribute, ref: Ref): IObserver {
	return addRef(host, getHostElementForHost(host), ref);
} /*# END IF hasHostAttributes && hasTemplateRefs */

export const hostAttributesHelperMap: IHostAttributesHelperMap = {
	/*# IF hasHostAttributes && hasTemplateAttributes */ __addAttributes: addAttributesForHost, /*# END IF hasHostAttributes && hasTemplateAttributes */
	/*# IF hasHostAttributes && hasTemplateAttributes */ __addAttribute: addAttributeForHost, /*# END IF hasHostAttributes && hasTemplateAttributes */
	/*# IF hasHostAttributes && hasTemplateAttributes */ __addProperties: addPropertiesForHost, /*# END IF hasHostAttributes && hasTemplateAttributes */
	/*# IF hasHostAttributes && hasTemplateAttributes */ __addProperty: addPropertyForHost, /*# END IF hasHostAttributes && hasTemplateAttributes */
	/*# IF hasHostAttributes && hasTemplateRefs */ __addRef: addRefForHost, /*# END IF hasHostAttributes && hasTemplateRefs */
	/*# IF hasHostAttributes && hasTemplateListeners */ __addListeners: addListenersForHost, /*# END IF hasHostAttributes && hasTemplateListeners */
	/*# IF hasHostAttributes && hasTemplateListeners */ __addListener: addListenerForHost, /*# END IF hasHostAttributes && hasTemplateListeners */
	/*# IF hasHostAttributes && hasTemplateCustomAttributes */ __addCustomAttribute: addCustomAttributeForHost /*# END IF hasHostAttributes && hasTemplateCustomAttributes */
};