import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {STATIC_CSS_FOR_HOST} from "./static-css-for-host";

/**
 * Adds all the static CSS of the host's parent to the host
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentStaticCSSForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (STATIC_CSS_FOR_HOST.has(parent)) {
		// Add all of the static CSS of the parent to the static CSS of the host
		STATIC_CSS_FOR_HOST.add(host, ...STATIC_CSS_FOR_HOST.get(parent));
	}
}