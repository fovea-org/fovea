import {ICustomAttributeConstructor, IFoveaHostConstructor} from "@fovea/common";
import {STATIC_TEMPLATES_FOR_HOST} from "./static-templates-for-host";

/**
 * Adds all the static templates of the host's parent to the host
 * @param {IFoveaHostConstructor|ICustomAttributeConstructor} host
 */
export function addParentStaticTemplatesForHost (host: IFoveaHostConstructor|ICustomAttributeConstructor): void {
	const parent = Object.getPrototypeOf(host);
	if (STATIC_TEMPLATES_FOR_HOST.has(parent)) {
		// Add all of the static templates of the parent to the static templates of the host
		STATIC_TEMPLATES_FOR_HOST.add(host, ...STATIC_TEMPLATES_FOR_HOST.get(parent));
	}
}