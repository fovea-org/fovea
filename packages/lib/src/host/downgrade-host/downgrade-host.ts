import {UPGRADED_HOSTS} from "../upgraded-hosts/upgraded-hosts";
import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {unbindHostListeners} from "../../listener/host-listener/unbind-host-listeners";
import {unbindVisibilityObservers} from "../../visibility/unbind-visibility-observers";
import {unbindStaticCSS} from "../../css/static-css/unbind-static-css";
import {unbindPropsForHost} from "../../prop/props-for-host/unbind-props-for-host/unbind-props-for-host";
import {unbindHostAttributesForHost} from "../../host-attributes/unbind-host-attributes-for-host/unbind-host-attributes-for-host";
import {unbindChildListObservers} from "../../dom-mutation/child-list-observers-for-host/unbind-child-list-observers";
import {unbindAttributeChangeObservers} from "../../dom-mutation/attribute-change-observers-for-host/unbind-attribute-change-observers";

/**
 * "Downgrades" a host
 * @param {IFoveaHost|ICustomAttribute} host
 */
export function downgradeHost (host: IFoveaHost|ICustomAttribute): void {

	/*# IF hasProps */ unbindPropsForHost(host); /*# END IF hasProps */
	/*# IF hasHostListeners */ unbindHostListeners(host); /*# END IF hasHostListeners */
	/*# IF hasVisibilityObservers */ unbindVisibilityObservers(host); /*# END IF hasVisibilityObservers */
	/*# IF hasStaticCSS */ unbindStaticCSS(host); /*# END IF hasStaticCSS */
	/*# IF hasChildListObservers */ unbindChildListObservers(host); /*# END IF hasChildListObservers */
	/*# IF hasAttributeChangeObservers */ unbindAttributeChangeObservers(host); /*# END IF hasAttributeChangeObservers */
	/*# IF hasHostAttributes */ unbindHostAttributesForHost(host); /*# END IF hasHostAttributes */

	// Take all TemplateResults for the host and dispose them.
	UPGRADED_HOSTS.popAll(host, templateResult => templateResult.dispose());
}