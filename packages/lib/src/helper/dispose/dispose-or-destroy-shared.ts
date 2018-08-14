import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {unbindPropsForHost} from "../../prop/props-for-host/unbind-props-for-host/unbind-props-for-host";
import {unbindHostListeners} from "../../listener/host-listener/unbind-host-listeners";
import {unbindVisibilityObservers} from "../../visibility/unbind-visibility-observers";
import {unbindStaticCSS} from "../../css/static-css/unbind-static-css";
import {unbindChildListObservers} from "../../dom-mutation/child-list-observers-for-host/unbind-child-list-observers";
import {unbindAttributeChangeObservers} from "../../dom-mutation/attribute-change-observers-for-host/unbind-attribute-change-observers";
import {unbindHostAttributesForHost} from "../../host-attributes/unbind-host-attributes-for-host/unbind-host-attributes-for-host";

/**
 * Shared logic for when a host is disposed or destroyed
 * @param {IFoveaHost|ICustomAttribute} host
 * @private
 */
export function disposeOrDestroyShared (host: IFoveaHost|ICustomAttribute): void {
	unbindPropsForHost(host);
	unbindHostListeners(host);
	unbindVisibilityObservers(host);
	unbindStaticCSS(host);
	unbindChildListObservers(host);
	unbindAttributeChangeObservers(host);
	unbindHostAttributesForHost(host);
}