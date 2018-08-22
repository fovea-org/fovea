import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";

/**
 * Bootstraps the constructor for a host by registering things like props, observers, listeners, etc
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function ___bootstrap (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	if (host.___useCSS != null) host.___useCSS();
	if (host.___useTemplates != null) host.___useTemplates();
	if (host.___registerChangeObservers != null) host.___registerChangeObservers();
	if (host.___registerProps != null) host.___registerProps();
	if (host.___registerSetOnHostProps != null) host.___registerSetOnHostProps();
	if (host.___registerListeners != null) host.___registerListeners();
	if (host.___registerEmitters != null) host.___registerEmitters();
	if (host.___registerVisibilityObservers != null) host.___registerVisibilityObservers();
	if (host.___registerChildListObservers != null) host.___registerChildListObservers();
	if (host.___registerAttributeChangeObservers != null) host.___registerAttributeChangeObservers();
	if (host.___registerHostAttributes != null) host.___registerHostAttributes();
}