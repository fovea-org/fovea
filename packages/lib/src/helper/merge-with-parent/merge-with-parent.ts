import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {addParentPropsForHost} from "../../prop/props-for-host/add-parent-props-for-host/add-parent-props-for-host";
import {addParentChangeObserversForHost} from "../../change-observer/change-observers-for-host/add-parent-change-observers-for-host";
import {addParentHostPropsForHost} from "../../prop/host-props-for-host/add-parent-host-props-for-host";
import {addParentHostListenersForHost} from "../../listener/host-listener/host-listeners-for-host/add-parent-host-listeners-for-host";
import {addParentEventEmittersForHost} from "../../event/host-event-emitters-for-host/add-parent-event-emitters-for-host";
import {addParentVisibilityObserversForHost} from "../../visibility/host-visibility-observers-for-host/add-parent-visibility-observers-for-host";
import {addParentStaticCSSForHost} from "../../css/static-css/add-parent-static-css-for-host";
import {addParentMutationObserversForHost} from "../../dom-mutation/mutation-observers-for-host/add-parent-mutation-observers-for-host";

/**
 * Merges the given host its' parent
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 * @private
 */
export function __mergeWithParent (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	/*# IF hasChangeObservers */ addParentChangeObserversForHost(host); /*# END IF hasChangeObservers */
	/*# IF hasProps */ addParentPropsForHost(host); /*# END IF hasProps */
	/*# IF hasHostProps */ addParentHostPropsForHost(host); /*# END IF hasHostProps */
	/*# IF hasHostListeners */ addParentHostListenersForHost(host); /*# END IF hasHostListeners */
	/*# IF hasEventEmitters */ addParentEventEmittersForHost(host); /*# END IF hasEventEmitters */
	/*# IF hasVisibilityObservers */ addParentVisibilityObserversForHost(host); /*# END IF hasVisibilityObservers */
	/*# IF hasMutationObservers */ addParentMutationObserversForHost(host); /*# END IF hasMutationObservers */
	/*# IF hasStaticCSS */ addParentStaticCSSForHost(host); /*# END IF hasStaticCSS */
}