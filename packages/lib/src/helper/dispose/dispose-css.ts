import {FoveaHost} from "@fovea/common";
import {getRootForNode} from "../../host/root-for-node/get-root-for-node/get-root-for-node";
import {BOUND_STATIC_CSS_FOR_ROOT} from "../../css/static-css/bound-static-css-for-root";
import {BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT} from "../../css/static-css/bound-static-css-templates-for-root";
import {ricScheduler} from "@fovea/scheduler";

/**
 * Disposes all static CSS from the given host some time in the future
 * @param {FoveaHost} host
 */
export function ___disposeCSS (host: FoveaHost): void {
	ricScheduler.mutate(disposeCSS.bind(null, host)).then();
}


/**
 * Disposes all static CSS from the given host
 * @param {FoveaHost} host
 */
function disposeCSS (host: FoveaHost): void {
	const root = getRootForNode(host.___hostElement);

	// Remove all the style fragments from their parents
	BOUND_STATIC_CSS_FOR_ROOT.popAll(root, fragment => {
		if (fragment.parentNode != null) fragment.parentNode.removeChild(fragment);
	});

	// Clear all templates for the root
	if (BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT.has(root)) {
		BOUND_STATIC_CSS_TEMPLATES_FOR_ROOT.delete(root);
	}
}
