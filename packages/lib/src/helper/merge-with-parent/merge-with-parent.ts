import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {addParentPropsForHost} from "../../prop/props-for-host/add-parent-props-for-host/add-parent-props-for-host";
import {addParentChangeObserversForHost} from "../../change-observer/change-observers-for-host/add-parent-change-observers-for-host";
import {addParentHostPropsForHost} from "../../prop/host-props-for-host/add-parent-host-props-for-host";
import {addParentHostListenersForHost} from "../../listener/host-listener/host-listeners-for-host/add-parent-host-listeners-for-host";
import {addParentEventEmittersForHost} from "../../event/host-event-emitters-for-host/add-parent-event-emitters-for-host";
import {addParentVisibilityObserversForHost} from "../../visibility/host-visibility-observers-for-host/add-parent-visibility-observers-for-host";
import {addParentStaticCSSForHost} from "../../css/static-css/add-parent-static-css-for-host";
import {addParentHostAttributesForHost} from "../../host-attributes/add-parent-host-attributes-for-host/add-parent-host-attributes-for-host";
import {addParentChildListObserversForHost} from "../../dom-mutation/child-list-observers-for-host/add-parent-child-list-observers-for-host";
import {addParentAttributeChangeObserversForHost} from "../../dom-mutation/attribute-change-observers-for-host/add-parent-attribute-change-observers-for-host";

/**
 * Merges the given host its' parent
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @private
 */
export function __mergeWithParent (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	addParentChangeObserversForHost(host);
	addParentPropsForHost(host);
	addParentHostPropsForHost(host);
	addParentHostListenersForHost(host);
	addParentEventEmittersForHost(host);
	addParentVisibilityObserversForHost(host);
	addParentChildListObserversForHost(host);
	addParentAttributeChangeObserversForHost(host);
	addParentStaticCSSForHost(host);
	addParentHostAttributesForHost(host);
}