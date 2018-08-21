import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {bindStaticCSS} from "../../css/static-css/bind-static-css";
import {bindHostAttributesForHost} from "../../host-attributes/bind-host-attributes-for-host/bind-host-attributes-for-host";
import {bindChildListObservers} from "../../dom-mutation/child-list-observers-for-host/bind-child-list-observers";
import {bindAttributeChangeObservers} from "../../dom-mutation/attribute-change-observers-for-host/bind-attribute-change-observers";

/**
 * Runs the common logic necessary to connect the provided host
 * @param {IFoveaHost|ICustomAttribute} host
 * @private
 */
export function connectBase (host: IFoveaHost|ICustomAttribute): void {
	if (host.___connectTemplate != null) host.___connectTemplate();
	if (host.___connectProps != null) host.___connectProps();
	if (host.___connectListeners != null) host.___connectListeners();
	if (host.___connectVisibilityObservers != null) host.___connectVisibilityObservers();
	bindStaticCSS(host);
	bindChildListObservers(host);
	bindAttributeChangeObservers(host);
	bindHostAttributesForHost(host);
}