import {ICustomAttribute, IFoveaHost} from "@fovea/common";

/**
 * Runs the common logic necessary to connect the provided host
 * @param {IFoveaHost|ICustomAttribute} host
 * @private
 */
export function connectBase (host: IFoveaHost|ICustomAttribute): void {
	if (host.___connectTemplates != null) host.___connectTemplates();
	if (host.___connectProps != null) host.___connectProps();
	if (host.___connectListeners != null) host.___connectListeners();
	if (host.___connectVisibilityObservers != null) host.___connectVisibilityObservers();
	if (host.___connectCSS != null) host.___connectCSS();
	if (host.___connectChildListObservers != null) host.___connectChildListObservers();
	if (host.___connectAttributeChangeObservers != null) host.___connectAttributeChangeObservers();
	if (host.___connectHostAttributes != null) host.___connectHostAttributes();
}