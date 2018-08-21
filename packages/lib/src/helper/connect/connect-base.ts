import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {bindHostAttributesForHost} from "../../host-attributes/bind-host-attributes-for-host/bind-host-attributes-for-host";
import {bindAttributeChangeObservers} from "../../dom-mutation/attribute-change-observers-for-host/bind-attribute-change-observers";

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
	bindAttributeChangeObservers(host);
	bindHostAttributesForHost(host);
}