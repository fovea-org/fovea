import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {bindHostListeners} from "../../listener/host-listener/bind-host-listeners";
import {bindVisibilityObservers} from "../../visibility/bind-visibility-observers";
import {bindStaticCSS} from "../../css/static-css/bind-static-css";
import {bindStaticTemplate} from "../../template/static-template/bind-static-template";
import {bindPropsForHost} from "../../prop/props-for-host/bind-props-for-host/bind-props-for-host";
import {bindHostAttributesForHost} from "../../host-attributes/bind-host-attributes-for-host/bind-host-attributes-for-host";
import {bindChildListObservers} from "../../dom-mutation/child-list-observers-for-host/bind-child-list-observers";
import {bindAttributeChangeObservers} from "../../dom-mutation/attribute-change-observers-for-host/bind-attribute-change-observers";

/**
 * Runs the common logic necessary to connect the provided host
 * @param {IFoveaHost|ICustomAttribute} host
 * @param {ShadowRoot|Element|undefined} root
 * @private
 */
export function connectBase (host: IFoveaHost|ICustomAttribute, root: ShadowRoot|Element|undefined): void {

	if (root != null) {
		bindStaticTemplate(host, root);
		bindPropsForHost(host);
		bindHostListeners(host);
		bindVisibilityObservers(host);
		bindStaticCSS(host);
		bindChildListObservers(host);
		bindAttributeChangeObservers(host);
		bindHostAttributesForHost(host);
	}
}