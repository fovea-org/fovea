import {ICustomAttribute, IFoveaHost} from "@fovea/common";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";
import {BOUND_STATIC_CSS_FOR_ROOT} from "./bound-static-css-for-root";
import {BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT} from "./bound-static-css-templates-for-root";
import {getHostElementForHost} from "../../host/host-element-for-host/get-host-element-for-host/get-host-element-for-host";

/*# IF hasStaticCSS */

/**
 * Unbinds all static CSS from the given host
 * @param {IFoveaHost | ICustomAttribute} host
 */
export function unbindStaticCSS (host: IFoveaHost|ICustomAttribute): void {
	try {
		const root = getRootForNode(getHostElementForHost(host));

		// Remove all the style fragments from their parents
		if (BOUND_STATIC_CSS_FOR_ROOT.has(root)) {
			BOUND_STATIC_CSS_FOR_ROOT.popAll(root, fragment => {
				if (fragment.parentNode != null) fragment.parentNode.removeChild(fragment);
			});
		}

		// Clear all templates for the root
		if (BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT.has(root)) {
			BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT.delete(root);
		}
	} catch (ex) {
		// This fails if no root could be detected. This is OK
	}
} /*# END IF hasStaticCSS */